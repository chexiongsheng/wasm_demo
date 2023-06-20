call emcc --no-entry -O3 call_qsort.c -o call_qsort.wasm -s EXPORTED_FUNCTIONS="['_sort_int_array']" -s ALLOW_TABLE_GROWTH=1
