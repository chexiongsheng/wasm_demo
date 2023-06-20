const fs = require('fs');

//const tbl = new WebAssembly.Table({ initial: 1, element: "anyfunc" });

const imports = {
    env: {
    }
};

const wasmSource = new Uint8Array(fs.readFileSync("call_qsort.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);

// ---- begin copy from clue code

function abort(what) {
  var e = new WebAssembly.RuntimeError(what);
  throw e;
}

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

function uleb128Encode(n, target) {
  assert(n < 16384);
  if (n < 128) {
    target.push(n);
  } else {
    target.push((n % 128) | 128, n >> 7);
  }
}

function sigToWasmTypes(sig) {
  var typeNames = {
    'i': 'i32',
    // i64 values will be split into two i32s.
    'j': 'i32',
    'f': 'f32',
    'd': 'f64',
    'p': 'i32',
  };
  var type = {
    parameters: [],
    results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
  };
  for (var i = 1; i < sig.length; ++i) {
    assert(sig[i] in typeNames, 'invalid signature char: ' + sig[i]);
    type.parameters.push(typeNames[sig[i]]);
    if (sig[i] === 'j') {
      type.parameters.push('i32');
    }
  }
  return type;
}

function generateFuncType(sig, target){
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'p': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  target.push(0x60 /* form: func */);
  uleb128Encode(sigParam.length, target);
  for (var i = 0; i < sigParam.length; ++i) {
    assert(sigParam[i] in typeCodes, 'invalid signature char: ' + sigParam[i]);
target.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    target.push(0x00);
  } else {
    target.push(0x01, typeCodes[sigRet]);
  }
}
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function == "function") {
    return new WebAssembly.Function(sigToWasmTypes(sig), func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSectionBody = [
    0x01, // count: 1
  ];
  generateFuncType(sig, typeSectionBody);

  // Rest of the module is static
  var bytes = [
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
    0x01, // Type section code
  ];
  // Write the overall length of the type section followed by the body
  uleb128Encode(typeSectionBody.length, bytes);
  bytes.push.apply(bytes, typeSectionBody);

  // The rest of the module is static
  bytes.push(
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  );

  // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(new Uint8Array(bytes));
  var instance = new WebAssembly.Instance(module, { 'e': { 'f': func } });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

// ---- end copy from clue code
    

function call_qsort(arr) {
    const savedStack = wasmInstance.exports.stackSave();
    const ptr = wasmInstance.exports.stackAlloc(arr.length * 4);
    const start = ptr >> 2;
    const heap = new Uint32Array(wasmInstance.exports.memory.buffer);
    
    
    for (let i = 0; i < arr.length; ++i) {
        heap[start + i] = arr[i];
    }
    
    function cmp(pa, pb) {
        return heap[pa >> 2] - heap[pb >> 2];
    }
    
    let cmpIndex = wasmInstance.exports.__indirect_function_table.grow(1);
    wasmInstance.exports.__indirect_function_table.set(cmpIndex, convertJsFunctionToWasm(cmp, 'iii'));

    wasmInstance.exports.sort_int_array(ptr, arr.length, cmpIndex);

    const result = [];
    for (let i = 0; i < arr.length; ++i) {
        result.push(heap[start + i]);
    }
    
    wasmInstance.exports.stackRestore(savedStack);
    return result;
}

const numbers = [14, 3, 7, 42];
console.log(numbers, 'becomes', call_qsort(numbers));

