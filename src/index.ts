import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
//import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from 'express';
//import { send } from "process";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { saeedMiddleProvider } from "./saeed-middle";
import { PostResolver } from "./resolvers/post";

const main = async () =>{
    
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();


    const app = express();

    const apoloServer = new ApolloServer({
         schema: await buildSchema({
             resolvers :[HelloResolver, PostResolver],
             validate : false
         }),
         context: ()=>({em: orm.em}),
     });
     apoloServer.applyMiddleware({app});

     saeedMiddleProvider().apply(app);

     // *********  Added for Create test **********************************************
     //orm.em.create(Post,{title:"post 2"});


    // ----- * Replace with graphql code ------
    app.get('/',(_, res)=>{
        res.send("Hello");
    });
    app.listen(4000, ()=>{
        console.log("Server started on localhost:4000");
    });

    // Create New Post
    //  const post = orm.em.create(Post,{title:"first post"});
    //  await orm.em.persistAndFlush(post);
    // console.log("--------SQL 2------- Create New post Method 2");
    // await orm.em.nativeInsert(Post,{ title: "second way"});    // error in run -> dont excute date class and set null for crate and updateAt column (soloution exist in post.ts file)

    // I cant run it.
    // const posts = await orm.em.find(Post,{});
    // console.log(posts);
}


main().catch((err) => {
    console.error(err)
})
console.log("hello Roojin!!!");