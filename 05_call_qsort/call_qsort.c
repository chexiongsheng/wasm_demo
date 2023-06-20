//emcc --no-entry -O3 call_qsort.c -o call_qsort.wasm -s EXPORTED_FUNCTIONS="['_sort_int_array']" -s ALLOW_TABLE_GROWTH=1
#include <stdlib.h>

typedef int (*compare_t)(const void *, const void*);

void sort_int_array(int *array, size_t len, compare_t compar) {
    qsort(array, len, sizeof(int), compar);
}