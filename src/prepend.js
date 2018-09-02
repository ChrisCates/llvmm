let fs = require('fs-jetpack');
let path = require('path');
let file = path.join(process.cwd(), 'dist', 'llvmvm.js');

let content = fs.read(file);

content = `#!/usr/bin/env node\n` + content;
fs.write(file, content);