import { EntityManager, MikroORM, RequestContext } from "@mikro-orm/core";
import { EntityRepository } from '@mikro-orm/mongodb';
import cors from 'cors';
import express from "express";
import http from "http";
import 'reflect-metadata';
import socket from "socket.io";
import { __prod__ } from "./constants";
import { AuthController } from './controllers/authController';
import { UserController } from './controllers/user.controller';
import mikroOrmConfig from "./mikro-orm.config";
import { Users } from './models/users';
declare module 'express-session' {
    interface SessionData {
      token: string;
    }
  }

if(!__prod__) require('dotenv').config()



export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    usersRepository: EntityRepository<Users>
}


const app = express()
const server = http.createServer(app)
const io = new socket.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
   
let userConnected = new Map<String, String>()
app.set('port', process.env.PORT || 5000)

const Main = async() => {


    
    //configuracion base de datos 

    DI.orm= await MikroORM.init(mikroOrmConfig)
    DI.em= DI.orm.em
    DI.usersRepository = DI.orm.em.getRepository(Users)


    app.use(express.json())
    app.use(cors({
        origin : '*'
    }))

    app.use((_, __, next) => RequestContext.create(DI.orm.em, next));


    app.get('/', (_,res) => {
        res.json({
            message: "Bienvenido a la API del chat tematico, visita la documentacion para ver como funciona"
        })
    })

 
    app.use('/users',UserController)

    app.use('/auth', AuthController)
    
    app.get('*',(req,res) => {
        res.status(404).json({
            route: req.path,
            message: 'Ruta no encontrada'
        })
    })

  
    //socket io    
    io.on('connection', (socket)=> {
        console.log('Conexion nueva: ', socket.id)
        
        socket.on('Register', (Username) => {
            userConnected.set(socket.id,Username)
    
        })
        
        socket.on('Join-Chat', (chat)=> {
            console.log(`${userConnected.get(socket.id)} se conecto a la sala ${chat}`)
            socket.join(chat)
            io.to(chat).emit('Bienvenida', `${userConnected.get(socket.id)}`)
        })
    
        socket.on('left-chat', (chat)=> {
            socket.leave(chat)
            io.to(chat).emit('Despedida',`${userConnected.get(socket.id)}` )
        })
    
        socket.on('Message', (Message,chat) =>{
            console.log(`[${userConnected.get(socket.id)}]{${chat}} -> ${Message}`)
            io.to(chat).emit('newMessage', {
                Message: Message,
                Sender: userConnected.get(socket.id)
            })
        } )
    
    
    } )

    server.listen(app.get('port'), ()=> {
        console.log(`Aplicacion corriendo en puerto ${app.get('port')}`)
    })
}

Main().catch(error => {
    console.error(error)
})