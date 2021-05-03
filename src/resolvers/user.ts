import { MyContext } from "../types";
import { Resolver, Mutation, InputType, Field, Arg, Ctx, ObjectType, Query } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
// import { ObjectBindingPattern } from "@mikro-orm/core";


@InputType()
class UsernamePasswordInput{
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;

    @Field()
    message: string;
}


@ObjectType()
class UserResponse {
    @Field(()=> [FieldError],{nullable:true})
    errors?: FieldError[];

    @Field(()=> User,{nullable:true})
    user?: User;
}

@Resolver()
export class UserResolver{
    @Query(()=> User, {nullable: true})
    async me(
        @Ctx() {req, em}: MyContext
    ){
        // if you are not logged in
        if(!req.session.userId){
            return null;
        }
        const user = await em.findOne(User, {id: req.session.userId});
        return user;

    }

    @Mutation(()=> UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse>
    {
        if(options.username.length <= 2){
            return{
                errors:[
                    {
                        field: "username",
                        message: "length must be greater than 2",
                    },
                ],
                
            };
        }

        if(options.password.length <= 4){
            return{
                errors:[
                    {
                        field: "password",
                        message: "length must be greater than 4",
                    },
                ],
                
            };
        }

        const hashedpassword = await argon2.hash(options.password);
        const user = em.create(User,{
                username: options.username,
                password: hashedpassword
            }); 
            try{
                await em.persistAndFlush(user);
            } catch(err) {
                // duplicate Username Error
                if(err.code === "23505"){ //  || err.detail.includes("already exists")){
                    return {
                        errors: [
                            {
                            field: "username",
                            message: "username already token",
                            },
                        ],

                    };
                }
            }

        // store user id session
        // this will set a cookie on the users
        // and keep them logged in 
        req.session.userId = user.id;

        return {user}; 
    }

    @Mutation(()=> UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(User, {username: options.username/*.toLowerCase()*/})
        if(!user){
            return {
                errors: [
                    {
                    field: "username",
                    message: "That username doesn't exist ",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return {
                errors: [
                    {
                    field: "password",
                    message: "incorrect password",
                    },
                ],
            };

        }
        req.session.userId = user.id;
        
        return {
            user,
        };
    }
}
    
