declare var process;
declare var require;

import 'colors';

import * as cli from 'cli';
import * as http from 'http';
import * as statusBar from 'status-bar';

import { scanner, scannerVersion, downloadBinary } from './scanner';

let options = cli.parse({
    os: ['o', 'The desired OS to work with', 'string', 'darwin'],
    version: ['v', 'The desired version of LLVM', 'string', null],
    binary: ['b', 'The desired binary for the version of LLVM', 'string', null],
    dir: ['d', 'The desired installation directory for LLVM', 'string', '~/.llvm/'],
    scan: ['s', 'Scan all available versions'],
    scanv: ['sv', 'Scan a specific version for packages', 'string', null],
    install: ['i', 'Specifies that you are trying to install a binary']
});

if (options['scan']) {
    scanner()
    .then(options => {
        console.log(options.formattedResponse);
    })
    .catch(err => {
        console.log(`${err}`.red);
    });
} else if (options['scanv'] != null) {
    scannerVersion(options['scanv'])
    .then(response => {
        console.log(response.formattedResponse);
    })
    .catch(err => {
        console.log(`${err}`.red);
    });
} else if (options['install'] != null) {
    downloadBinary(
        options['version'],
        parseInt(options['binary'])
    ).then(response => {
        console.log(response.formattedResponse);
        let url = 'http://releases.llvm.org/' + response.selectedBinary.url;
        var bar;

        http.get(url, (res) => {
            bar = statusBar.create({ total: res.headers['content-length'] })
            .on('render', function (stats) {
                process.stdout.write(
                    this.format.storage(stats.currentSize) + ' ' +
                    this.format.speed(stats.speed) + ' ' +
                    this.format.time(stats.elapsedTime) + ' ' +
                    this.format.time(stats.remainingTime) + ' [' +
                    this.format.progressBar(stats.percentage) + '] ' +
                    this.format.percentage(stats.percentage));
                process.stdout.cursorTo(0);
            });
        
            res.pipe(bar);
        })
        .on('close', () => [
            console.log(`\n\nFinished downloading ${response.selectedBinary['title']}, it should appear in your downloads folder.\n`.green)
        ])
        .on('error', (err) => {
            if (bar) bar.cancel();
            console.error(`${err}`.red);
        })
    })
    .catch(err => {
        console.log(`${err}`.red);
    })
}