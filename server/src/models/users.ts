import {  Entity, Property, Unique } from "@mikro-orm/core";
import { BaseModel } from "./Base";

@Entity()
export class Users extends BaseModel {

    @Unique()
    @Property()
    username: string

    @Property()
    password: string

    @Property()
    name: string


    constructor(username: string, password:string,nombre:string){
        super()
        this.name=nombre
        this.username=username
        this.password=password
    }
}