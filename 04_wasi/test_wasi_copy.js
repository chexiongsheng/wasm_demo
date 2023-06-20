//node --experimental-wasi-unstable-preview1 test_wasi_copy.js /sandbox/buid.sh /sandbox/buid.sh.bak

const wasi  = require( 'wasi');
const fs = require('fs');
const process = require('process');

const wasiInstance = new wasi.WASI({
  args: process.argv.slice(1),
  env: process.env,
  preopens: {
    '/sandbox': '.'
  }
});

const imports = {
    wasi_snapshot_preview1: wasiInstance.wasiImport
};

const wasmSource = new Uint8Array(fs.readFileSync("wasi_copy.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);

wasiInstance.start(wasmInstance);

