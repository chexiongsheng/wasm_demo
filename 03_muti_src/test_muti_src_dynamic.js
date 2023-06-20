const fs = require('fs');

const fooWasmSource = new Uint8Array(fs.readFileSync("foo.wasm"));
const fooWasmModule = new WebAssembly.Module(fooWasmSource);
const fooWasmInstance = new WebAssembly.Instance(fooWasmModule, {
    env: {
        bar: function() {
            return barWasmInstance.exports.bar.apply(null, arguments);
        }
    }
});

const barWasmSource = new Uint8Array(fs.readFileSync("bar.wasm"));
const barWasmModule = new WebAssembly.Module(barWasmSource);
const barWasmInstance = new WebAssembly.Instance(barWasmModule, {env: {memory: fooWasmInstance.exports.memory}});

const result = fooWasmInstance.exports.foo(100);
console.log(result);
