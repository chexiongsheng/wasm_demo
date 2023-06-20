emcc --no-entry -O3 adder.c -o adder.wasm -s EXPORTED_FUNCTIONS="['_add']"
