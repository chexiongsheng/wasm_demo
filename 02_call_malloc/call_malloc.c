#include <stdlib.h>

//emcc --no-entry -O3 call_malloc.c -o call_malloc.wasm -s EXPORTED_FUNCTIONS="['_allocStr','_freeStr']"
void* allocStr(int len) {
    int i;
    char* p = (char*)malloc(len + 1);
    for(i = 0; i < len; i++) {
        p[i] = 'a' + (char)i;
    }
    p[len] = '\n';
    return p;
}

void freeStr(char* p) {
    if (p) free(p);
}
