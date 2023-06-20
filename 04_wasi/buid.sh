#emcc(3.1.37) not work
#download and install wasi-sdk from https://github.com/WebAssembly/wasi-sdk, https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-20/wasi-sdk-20.0-linux.tar.gz

/mnt/d/Software/wasi-sdk-20.0/bin/clang --target=wasm32-unknown-wasi --sysroot /mnt/d/Software/wasi-sdk-20.0/share/wasi-sysroot -s -o wasi_copy.wasm wasi_copy.c
