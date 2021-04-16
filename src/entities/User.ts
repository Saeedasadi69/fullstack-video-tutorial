import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity() 
export class User {
    @Field()  // with this line can decide to show(expose) column in graphql or No(hide) 
    @PrimaryKey()
    id!:number;

    @Field(()=> String)
    @Property({type:"date"})  // prevent null dates insert -> @Property({type:"date", defualt: 'NOW()'})
    creaatedAt = new Date()

    @Field(()=> String)
    @Property({ type:"date", onUpdate: () => new Date() })
    updatedAt = new Date()

    @Field()
    @Property({type: "text", unique: true})
    username!: string;


    @Property({type: "text"})
    password!: string;

}