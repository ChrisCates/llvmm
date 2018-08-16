declare var process;
declare var require;

import 'colors';

import * as cli from 'cli';
import { scanner, scannerVersion } from './scanner';

let options = cli.parse({
    os: ['o', 'The desired OS to work with', 'string', 'darwin'],
    version: ['v', 'The desired version of LLVM', 'string', '6.0.1'],
    dir: ['d', 'The desired installation directory for LLVM', 'string', '~/.llvm/'],
    scan: ['s', 'Scan all available versions'],
    scanv: ['sv', 'Scan a specific version for packages', 'string', null]
});

console.log(options);

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
}