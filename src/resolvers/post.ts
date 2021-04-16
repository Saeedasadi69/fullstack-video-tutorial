import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
//import e from "express";



@Resolver()
export class PostResolver{
    @Query(()=>[Post])
    posts(
        @Ctx() {em}: MyContext ): Promise<Post[]>
    {
        return em.find(this.posts,{});
    }

    @Query(()=>Post, {nullable: true})
    post(
        @Arg("id", () => Int) id: Number,
        @Ctx() {em}: MyContext ): Promise<Post | null>
    {
        return em.findOne(this.posts,{id});
    }

    @Mutation(()=>Post)
    async createPost(
        @Arg("tittle") tittle: String,
        @Ctx() {em}: MyContext ): Promise<Post>
    {
        const post = em.create(Post, {tittle});
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(()=>Post , {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("tittle", ()=> String, {nullable: true}) tittle: string,
        @Ctx() {em}: MyContext ): Promise<Post | null>
    {
        const post = await em.findOne(Post, {id});
        if(!post){
            return null
        }
        if(typeof tittle !== "undefined"){
            post.title= tittle; 
            await em.persistAndFlush(post);
        }
        return post;
    }


    @Mutation(()=> Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext): Promise<boolean>
    {
        await em.nativeDelete(Post, {id});
        return true;
    }
}
    