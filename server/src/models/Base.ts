import {  PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";


export class BaseModel {

    @PrimaryKey()
    _id: ObjectId;

    @SerializedPrimaryKey()
    id!: string; // won't be saved in the database

        
    @Property({type: 'date', default: 'NOW()' })
    createdAt = new Date();

  
    @Property({ type: 'date' , onUpdate: () => new Date()})
    updatedAt = new Date();
}