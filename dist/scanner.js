"use strict";
exports.__esModule = true;
require("colors");
var superagent = require("superagent");
var cheerio = require("cheerio");
var CryptoJS = require("crypto-js");
var SHA256 = CryptoJS.SHA256;
exports.LLVMURL = 'http://releases.llvm.org/download.html';
function scanner() {
    return new Promise(function (resolve, reject) {
        superagent
            .get(exports.LLVMURL)
            .end(function (err, res) {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            }
            else {
                var HTML = res.text;
                var $_1 = cheerio.load(HTML);
                var versions_1 = [];
                $_1('table.rel_section a').each(function (i, el) {
                    var title = $_1(el).text();
                    if (title.indexOf('Download') != -1) {
                        var version = title.replace('Download ', '');
                        versions_1.unshift(version);
                    }
                });
                var formattedResponse_1 = "Versions Available:\n".green;
                versions_1.forEach(function (version, i) {
                    var hash = SHA256(version).toString();
                    var numberFormat = i + 1 + ")";
                    var versionFormat = "" + version;
                    for (var i = numberFormat.length; i < 4; i++) {
                        numberFormat += " ";
                    }
                    for (var i = versionFormat.length; i < 10; i++) {
                        versionFormat += " ";
                    }
                    var option = ("  " + numberFormat + " " + versionFormat + " | SHA256 " + hash + "\n").blue;
                    formattedResponse_1 += option;
                });
                formattedResponse_1 += "\nYou can run --scanv [#] to find the versions of LLVM you want.\n".green;
                return resolve({ versions: versions_1, formattedResponse: formattedResponse_1 });
            }
        });
    });
}
exports.scanner = scanner;
function scannerVersion(version) {
    var versionInt = parseInt(version);
    console.log(("Scanning for LLVM Release #" + versionInt + "...").green);
    return new Promise(function (resolve, reject) {
        superagent
            .get(exports.LLVMURL)
            .end(function (err, res) {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            }
            else {
                var HTML = res.text;
                var $_2 = cheerio.load(HTML);
                var versions_2 = [];
                $_2('table.rel_section').each(function (i, el) {
                    var title = $_2(el).find('a').text();
                    if (title.indexOf('Download') != -1) {
                        var name_1 = title.replace('Download ', '');
                        versions_2.unshift({
                            name: name_1,
                            el: el
                        });
                    }
                });
                var selected = versions_2[versionInt - 1];
                var sel = selected['el'];
                console.log(("#" + versionInt + " is " + selected['name'] + " with the available binaries:\n").green);
                var binaries_1 = [];
                $_2(sel).next().find('ul:last-of-type a').each(function (i, el) {
                    var title = $_2(el).text();
                    if (title != '(.sig)') {
                        binaries_1.unshift(title);
                    }
                });
                var formattedResponse_2 = "";
                binaries_1.forEach(function (bin, i) {
                    var numberFormat = i + 1 + ")";
                    for (var i = numberFormat.length; i < 4; i++) {
                        numberFormat += " ";
                    }
                    formattedResponse_2 += (numberFormat + " " + bin + "\n").blue;
                });
                formattedResponse_2 += "\nIf you want to install a binary run --install --version [#] --binary [#]\n".green;
                return resolve({ binaries: binaries_1, formattedResponse: formattedResponse_2 });
            }
        });
    });
}
exports.scannerVersion = scannerVersion;
function downloadBinary(version, binary) {
    var versionInt = parseInt(version);
    return new Promise(function (resolve, reject) {
        superagent
            .get(exports.LLVMURL)
            .end(function (err, res) {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            }
            else {
                var HTML = res.text;
                var $_3 = cheerio.load(HTML);
                var versions_3 = [];
                $_3('table.rel_section').each(function (i, el) {
                    var title = $_3(el).find('a').text();
                    if (title.indexOf('Download') != -1) {
                        var name_2 = title.replace('Download ', '');
                        versions_3.unshift({
                            name: name_2,
                            el: el
                        });
                    }
                });
                var selected = versions_3[versionInt - 1];
                var sel = selected['el'];
                var binaries_2 = [];
                $_3(sel).next().find('ul:last-of-type a').each(function (i, el) {
                    var title = $_3(el).text();
                    var url = $_3(el).attr('href');
                    if (title != '(.sig)') {
                        binaries_2.unshift({ title: title, url: url });
                    }
                });
                var formattedResponse = "";
                var selectedBinary = binaries_2[binary - 1];
                formattedResponse += ("\nWe are downloading " + selectedBinary['title'] + " for Version #" + versionInt + " (" + selected['name'] + ") now.\n").green;
                return resolve({ selectedBinary: selectedBinary, formattedResponse: formattedResponse });
            }
        });
    });
}
exports.downloadBinary = downloadBinary;
