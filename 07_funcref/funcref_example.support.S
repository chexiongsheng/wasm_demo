.globl __indirect_function_table
.tabletype __indirect_function_table, funcref

.globl funcptr_to_funcref

funcptr_to_funcref:
    .functype funcptr_to_funcref(i32) -> (funcref)
        local.get 0
        table.get __indirect_function_table
    end_function
