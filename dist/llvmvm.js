#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("colors");
var cli = require("cli");
var http = require("http");
var statusBar = require("status-bar");
var scanner_1 = require("./scanner");
var options = cli.parse({
    os: ['o', 'The desired OS to work with', 'string', 'darwin'],
    version: ['v', 'The desired version of LLVM', 'string', null],
    binary: ['b', 'The desired binary for the version of LLVM', 'string', null],
    dir: ['d', 'The desired installation directory for LLVM', 'string', '~/.llvm/'],
    scan: ['s', 'Scan all available versions'],
    scanv: ['sv', 'Scan a specific version for packages', 'string', null],
    install: ['i', 'Specifies that you are trying to install a binary']
});
if (options['scan']) {
    scanner_1.scanner()
        .then(function (options) {
        console.log(options.formattedResponse);
    })["catch"](function (err) {
        console.log(("" + err).red);
    });
}
else if (options['scanv'] != null) {
    scanner_1.scannerVersion(options['scanv'])
        .then(function (response) {
        console.log(response.formattedResponse);
    })["catch"](function (err) {
        console.log(("" + err).red);
    });
}
else if (options['install'] != null) {
    scanner_1.downloadBinary(options['version'], parseInt(options['binary'])).then(function (response) {
        console.log(response.formattedResponse);
        var url = 'http://releases.llvm.org/' + response.selectedBinary.url;
        var bar;
        http.get(url, function (res) {
            bar = statusBar.create({ total: res.headers['content-length'] })
                .on('render', function (stats) {
                process.stdout.write(this.format.storage(stats.currentSize) + ' ' +
                    this.format.speed(stats.speed) + ' ' +
                    this.format.time(stats.elapsedTime) + ' ' +
                    this.format.time(stats.remainingTime) + ' [' +
                    this.format.progressBar(stats.percentage) + '] ' +
                    this.format.percentage(stats.percentage));
                process.stdout.cursorTo(0);
            });
            res.pipe(bar);
        })
            .on('close', function () { return [
            console.log(("\n\nFinished downloading " + response.selectedBinary['title'] + ", it should appear in your downloads folder.\n").green)
        ]; })
            .on('error', function (err) {
            if (bar)
                bar.cancel();
            console.error(("" + err).red);
        });
    })["catch"](function (err) {
        console.log(("" + err).red);
    });
}
