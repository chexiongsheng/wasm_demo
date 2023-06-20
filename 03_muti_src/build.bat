call emcc foo.c -c -O3 -o foo.o
call emcc bar.c -c -O3 -o bar.o
call emcc foo.o bar.o --no-entry  -O3 -o muti_src.wasm -s EXPORTED_FUNCTIONS="['_foo']"
del foo.o bar.o

call emcc bar.c -O3 -s SIDE_MODULE=1 -o bar.wasm
call emcc foo.c --no-entry  -O3 -o foo.wasm -s EXPORTED_FUNCTIONS="['_foo']" -s WARN_ON_UNDEFINED_SYMBOLS=0

