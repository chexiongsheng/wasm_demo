//emcc --no-entry -O3 pass_externref.c -o pass_externref.wasm -s EXPORTED_FUNCTIONS="['_pass_externref']" -mreference-types
//#include <emscripten.h>

//https://qiita.com/nokotan/items/5ca70b19818cd8776221
typedef char __attribute__((address_space(10)))* externref;

externref pass_externref(externref p) {
    return p;
}
