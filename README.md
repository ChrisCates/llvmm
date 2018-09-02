# LLVMVM
## By Chris Cates :star:
### LLVM Version Manager and Downloader for Unix

## Usage

1. Install via npm or yarn:

```bash
# With npm
sudo npm install @chriscates/llvmvm -g

# With yarn
yarn global add @chriscates/llvmvm
```

2. Interact with LLVMVM and install what you need:

```bash
# llvmvm help output
llvmvm --help

# Get list of all available versions of llvm
llvmvm --scan

# Get specific OSes for a selected version
llvmvm --scanv 45

# Download and Install a specific version of LLVM
llvmvm --install --version 45 --binary 15
```

## Compiling for yourself

Assuming you have Typescript Compiler installed for Node.js... All you need to do is run:

```bash
# To build the scripts
yarn build 

# To test the script itself
yarn start --help
```

## Additional Notes

- This project pulls versions from `https://llvm.org/`. llvmvm will always be up to date... Unless llvm.org migrates to a different website.

- Make sure to verbosely specify the OS you want to install llvm for.

- MIT Licensed :heart: