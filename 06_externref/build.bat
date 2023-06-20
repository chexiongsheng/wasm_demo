call emcc --no-entry -O3 pass_externref.c -o pass_externref.wasm -s EXPORTED_FUNCTIONS="['_pass_externref']" -mreference-types

