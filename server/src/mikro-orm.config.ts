import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import path from "path";
import { Users } from "./models/users";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
if(!__prod__) require('dotenv').config()
  
export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/ 
    },
    entities: [Users],
    clientUrl: process.env.DATABASE_URL,
     dbName:  process.env.DB_NAME,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // host: process.env.DB_HOST,
    highlighter: new MongoHighlighter(),
    type: 'mongo',
    debug: !__prod__,
    ensureIndexes: true
    
} as Parameters<typeof MikroORM.init>[0];