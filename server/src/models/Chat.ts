import { Entity, OneToOne, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";
import { BaseModel } from "./Base";
import { Users } from "./users";
@Entity()
export class Chat extends BaseModel {
  @Property({ nullable: true })
  @Unique()
  ChatID: string = v4();

  @Property()
  Nombre: string;

  @OneToOne({ entity: () => Users, owner: true })
  createdBy: Users;

  @Property({ nullable: true })
  Descripcion?: string;
}
