#include <stdlib.h>

extern int bar(int* array, int size);

int foo(int size)
{
    int i, ret;
    int* p = (int*)malloc(size * 4);
    for(i = 0; i < size; i++) {
        p[i] = i;
    }
    ret = bar(p, size);
    free(p);
    return ret;
}
