emcc --no-entry -O3 call_malloc.c -o call_malloc.wasm -s EXPORTED_FUNCTIONS="['_allocStr','_freeStr']"
