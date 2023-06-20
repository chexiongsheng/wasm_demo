//emcc --no-entry -O3 funcref_example.c funcref_example.support.S -o funcref_example.wasm -s EXPORTED_FUNCTIONS="['_setTimeoutByCFunc']" -mreference-types -s WARN_ON_UNDEFINED_SYMBOLS=0
//#include <emscripten.h>

typedef char __attribute__((address_space(20)))* funcref;
typedef void* funcref_ptr;

// imported from javascript
extern int setTimeout(funcref callback, int timeout);
extern funcref funcptr_to_funcref(funcref_ptr);
extern void printSomeInfo();

// not worked
//EM_JS(funcref, funcptr_to_funcref, (funcref_ptr funcptr), {
//    return wasmTable.add(funcptr);
//});

void some_proc() {
    printSomeInfo();
}

void setTimeoutByCFunc(int i) {
    setTimeout(funcptr_to_funcref((funcref_ptr)&some_proc), i);
}
