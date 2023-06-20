//node --experimental-wasm-reftypes test_pass_externref.js

const fs = require('fs');

const wasmSource = new Uint8Array(fs.readFileSync("pass_externref.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
    env: {
    }
});

const input = { message: 'Hello, WebAssembly!' };
const output = wasmInstance.exports.pass_externref(input);
console.log('Input:', input);
console.log('Output:', output);
