#!/usr/bin/env node

declare var process;

import 'colors';

import * as meow from 'meow';
import { read } from 'fs-jetpack';
import { join } from 'path';

let cliInfo = read(join(__dirname, 'cli.info.txt'));

let cli = meow(
    cliInfo,
    {

    }
)