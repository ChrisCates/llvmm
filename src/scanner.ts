declare var Promise;
import 'colors';

import * as superagent from 'superagent';
import * as cheerio from 'cheerio';
import * as CryptoJS from 'crypto-js';

let SHA256 = CryptoJS.SHA256;

console.log(SHA256("Message").toString());

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

                    for (var i = numberFormat.length; i < 5; i++) {
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
    return new Promise((resolve, reject) => {
        superagent
        .get(LLVMURL)
        .end((err, res) => {
            if (err) {
                return reject('LLVM Download Page seems to be down');
            } else {
                let HTML = res.text;
                let $ = cheerio.load(HTML);

                $('div.rel_boxtext ul:last-of-type a').each((i, el) => {
                    let title = $(el).text();
                    let sig = title.match('(.sig)') ? true : false;
                    let src = title.toLowerCase().match('source code') ? true : false;
                    let test = title.toLowerCase().match('test suite') ? true : false;
                    
                    if (!sig && !src && !test) {
                        console.log(i, title);
                    }
                });

                return resolve('success');
            }
        });
    });
}