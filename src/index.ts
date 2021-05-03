import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./contants";
//import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
//import { send } from "process";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { saeedMiddleProvider } from "./saeed-middle";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";


const main = async () =>{
    
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();


    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient()

    app.use(
    session({
        name: 'qid',
        store: new RedisStore({ 
            client: redisClient,
            disableTouch:true
         }),
         cookie:{
             maxAge: 1000*60*60*24*365*10, //10 years
             httpOnly: true,
             sameSite: 'lax', // csrf
             secure: __prod__ // coocies only works in https
         },
         saveUninitialized: false,
        secret: 'keyboardCat-asdasdasnkakdqwoiejqworh,mcnv',
        resave: false,
    })
    )


    const apoloServer = new ApolloServer({
         schema: await buildSchema({
             resolvers :[HelloResolver, PostResolver, UserResolver],
             validate : false
         }),
         context: ({req, res}): MyContext =>({em: orm.em, req, res}),
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

// let myCar: { name: string, model: string, year: number };

// myCar = {
//     name: 'honda',
//     model: 'B21',
//     year: 1998,
// };

// const myFunc = (name: string, model: string, year: number) => {
//     console.log(name, model, year);
// };

// const myFunc1 = (myCar: any) => {
//    log(myCar.naame)
// };

// myFunc1({
//     name1: 'honda',
//     model: 'B21',
//     year: 1998,
// });

// myFunc(myCar);
