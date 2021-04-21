import express from "express";
import http from "http";
import socket from "socket.io";
if(process.env.NODE_ENV !== 'production') require('dotenv').config()


const app = express()
const server = http.createServer(app)
const io = new socket.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

//middleware
app.set('port', process.env.PORT || 5000)








//socket io

let userConnected = new Map<String, String>()



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