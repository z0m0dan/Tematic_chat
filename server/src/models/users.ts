import {
  Collection,
  Entity,
  ManyToMany,
  Property,
  Unique,
} from "@mikro-orm/core";
import { BaseModel } from "./Base";
import { Chat } from "./Chat";

@Entity()
export class Users extends BaseModel {
  @Unique()
  @Property()
  username: string;

  @Property()
  password: string;

  @Property()
  name: string;

  @ManyToMany(() => Chat)
  SavedChats = new Collection<Chat>(this);

  constructor(username: string, password: string, nombre: string) {
    super();
    this.name = nombre;
    this.username = username;
    this.password = password;
  }
}
