//node --experimental-wasm-reftypes test_funcref_example.js

const fs = require('fs');

const wasmSource = new Uint8Array(fs.readFileSync("funcref_example.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
    env: {
        printSomeInfo: function() {
            console.log('printSomeInfo')
        },
        setTimeout: setTimeout
    }
});

wasmInstance.exports.setTimeoutByCFunc(2000);
