declare var Promise;
import 'colors';

import * as superagent from 'superagent';
import * as cheerio from 'cheerio';
import * as CryptoJS from 'crypto-js';

let SHA256 = CryptoJS.SHA256;

export const LLVMURL = 'http://releases.llvm.org/download.html';

export function scanner() {
    return new Promise((resolve, reject) => {
        superagent
        .get(LLVMURL)
        .end((err, res) => {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            } else {
                let HTML = res.text;
                let $ = cheerio.load(HTML);

                let versions = [];

                $('table.rel_section a').each((i, el) => {
                    let title = $(el).text();
                    if (title.indexOf('Download') != -1) {
                        let version = title.replace('Download ', '');
                        versions.unshift(version);
                    }
                });

                let formattedResponse = `Versions Available:\n`.green;
                
                versions.forEach((version, i) => {
                    let hash = SHA256(version).toString();
                    let numberFormat = `${i + 1})`;
                    let versionFormat = `${version}`;

                    for (var i = numberFormat.length; i < 4; i++) {
                        numberFormat += " ";
                    }

                    for (var i = versionFormat.length; i < 10; i++) {
                        versionFormat += " ";
                    }

                    let option = `  ${numberFormat} ${versionFormat} | SHA256 ${hash}\n`.blue;

                    formattedResponse += option;
                });

                formattedResponse += `\nYou can run --scanv [#] to find the versions of LLVM you want.\n`.green;

                return resolve({ versions, formattedResponse });
            }
        });
    });
}

export function scannerVersion(version) {
    let versionInt = parseInt(version);
    console.log(`Scanning for LLVM Release #${versionInt}...`.green);

    return new Promise((resolve, reject) => {
        superagent
        .get(LLVMURL)
        .end((err, res) => {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            } else {
                let HTML = res.text;
                let $ = cheerio.load(HTML);

                let versions = [];

                $('table.rel_section').each((i, el) => {
                    let title = $(el).find('a').text();
                    if (title.indexOf('Download') != -1) {
                        let name = title.replace('Download ', '');
                        versions.unshift({
                            name,
                            el
                        });
                    }
                });

                let selected = versions[versionInt - 1];
                let sel = selected['el'];

                console.log(`#${versionInt} is ${selected['name']} with the available binaries:\n`.green);

                let binaries = [];

                $(sel).next().find('ul:last-of-type a').each((i, el) => {
                    let title = $(el).text();
                    if (title != '(.sig)') {
                        binaries.unshift(title);
                    }
                });

                let formattedResponse = ``;

                binaries.forEach((bin, i) => {
                    let numberFormat = `${i + 1})`;

                    for (var i = numberFormat.length; i < 4; i++) {
                        numberFormat += " ";
                    }

                    formattedResponse += `${numberFormat} ${bin}\n`.blue;
                });

                formattedResponse += `\nIf you want to install a binary run --install --version 6.0.1 --binary [#]\n`.green

                return resolve({ binaries, formattedResponse });
            }
        });
    });
}