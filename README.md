# LLVMVM
## By Chris Cates :star:
### LLVM Version Manager for UNIX

## Usage

1. Install via npm or yarn:

```bash
# With npm
sudo npm install llvmvm -g

# With yarn
yarn global add llvmvm
```

2. Add llvmvm to your $PATH

```bash
# In your ~/.bash_profile add this:
export LLVMVM="$HOME/.llvmvm/active"
export PATH="$LLVMVM:$PATH"
```

3. Interact with LLVMVM and install what you need:

```bash
# llvmvm help output
llvmvm

# or...
llvmvm --help

# Get list of all available versions of llvm
llvmvm list

# Install a specified version of llvm
llvmvm install 4.0 darwin
```

## Additional Notes

- This project pulls versions from `https://llvm.org/`. llvmvm will always be up to date... Unless llvm.org migrates to a different website.

- Make sure to verbosely specify the OS you want to install llvm for.

- MIT Licensed :heart: