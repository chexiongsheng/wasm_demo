//node --experimental-wasm-reftypes --expose-gc test_global_externref.js

const fs = require('fs');

const wasmSource = new Uint8Array(fs.readFileSync("global_externref.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
    env: {
    }
});

const setExternref = wasmInstance.exports.set_externref;
const getExternref = wasmInstance.exports.get_externref;

const registry = new FinalizationRegistry((key) => {
    console.log(`${key} Finalization`);
});

function test(objKey, refByWasm, releaseRef) {
    let obj = { message: 'Hello, WebAssembly!' };
    if (refByWasm) setExternref(obj);

    registry.register(obj, objKey);

    obj = undefined;

    //console.log('getExternref:', getExternref());
    if (refByWasm && releaseRef) setExternref(undefined);
    //console.log('getExternref:', getExternref());
}

test('objRefAndRelaseByWasm', true, true); 
test('objRefByWasm', true);
test('objNotRefByWasm', false);

setInterval(() => {
    gc();
}, 1);

setTimeout(() => {
    console.log("release externref after 8 sec");
    setExternref(undefined);
}, 8000);