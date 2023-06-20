const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function loadWasmModule(filename) {
  const wasmBinary = await readFile(filename);
  const wasmModule = await WebAssembly.compile(wasmBinary);
  return wasmModule;
}

async function main() {
  const barModule = await loadWasmModule('bar.wasm');
  const fooModule = await loadWasmModule('foo.wasm');
  
  const memory = new WebAssembly.Memory({ initial: 256 });

  const barInstance = await WebAssembly.instantiate(barModule, {env: {
      memory: memory,
    },});

  const fooInstance = await WebAssembly.instantiate(fooModule, {
    env: {
      memory: memory,
      bar: barInstance.exports.bar,
    },
  });

  const foo = fooInstance.exports.foo;
  const result = foo(10);
  console.log('Result:', result);
}

main().catch((err) => {
  console.error(err);
});