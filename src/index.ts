import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
import { Post } from "./entities/Post";

const main = async () =>{
    const orm = await MikroORM.init({
        entities:[Post],
        dbName:"tsdb",
        type:"postgresql",
        debug:!__prod__
    });

     const post = orm.em.create(Post,{title:"first post"});
     await orm.em.persistAndFlush(post);
    console.log();
    // await orm.em.nativeInsert(Post,{ title: "second way"});
}

main().catch((err) => {
    console.error(err)
})


console.log("hello Roojin !!!");

