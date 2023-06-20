const fs = require('fs');

const wasmSource = new Uint8Array(fs.readFileSync("adder.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
    env: {
    }
});

const result = wasmInstance.exports.add(2, 40);
console.log(result);
