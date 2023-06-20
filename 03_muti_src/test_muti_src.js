const fs = require('fs');

const wasmSource = new Uint8Array(fs.readFileSync("muti_src.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
    env: {
    }
});

const result = wasmInstance.exports.foo(100);
console.log(result);
