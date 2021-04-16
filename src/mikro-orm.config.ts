import { __prod__ } from "./contants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import  path from 'path';


export default {  
    migrations:{   // copy from web (https://mikro-orm.io/docs/migrations#configuration)
        path: path.join(__dirname, './migrations'), 
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities:[Post],
    dbName:"tsdb",
    type:"postgresql",
    debug:!__prod__,
} as Parameters<typeof MikroORM.init>[0];



/* 
const bob = {  
        entities:[Post],
        dbName:"tsdb",
        type:"postgresql",
        debug:!__prod__,
    } as const; 
bob.dbName   //with or without as const have different result (string and true dbname)
bob.type   //with or without as const have different result (string and true postgresql database type) */