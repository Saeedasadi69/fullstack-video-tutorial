import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() 
export class Post {
    @PrimaryKey()
    id!:number;

    @Property({type:"date"})  // prevent null dates insert -> @Property({type:"date", defualt: 'NOW()'})
    creaatedAt = new Date()

    @Property({ type:"date", onUpdate: () => new Date() })
    updatedAt = new Date()

    @Property({type: "text"})
    title!: string;
}