import React, { useEffect, useState } from 'react'
import { MainChatContainer } from '../components/ChatBody'
import { ChatsListContainer } from '../components/ChatListContainer'
import { Flex } from '@chakra-ui/react'
import { chatData, Message } from '../types'
import { io } from 'socket.io-client'


const cliente = io('http://localhost:5000')
let nombre:string | null

const Dashboard = () => {
    const [getMessages, setMessages] = useState(new Array<Message>())
    const [selectedChat, setSelectedChat] = useState<chatData>({id:'', nombre:''})
    const [currentUser, setCurrentUser] = useState('')
    const setNewMessage = (Message: Message) => {
        setMessages(Messages => [...Messages, Message])
    }
    const eraseMessages = () => {
        setMessages(new Array<Message>())
    }

    useEffect(()=> {
       nombre = prompt('Cual es el nombre que usaras?')
        cliente.emit('Register', nombre)
        cliente.on('Bienvenida', (Mensaje) => {
            setNewMessage({
                Sender: 'SERVER', 
                Message:` ${Mensaje} se ha unido`,
                Time: new Date(Date.now())
            })
        })

        cliente.on('Despedida', (Mensaje) => {
            setNewMessage({
                Sender: 'SERVER', 
                Message:` ${Mensaje} ha salido de la sala`,
                Time: new Date(Date.now())
            })
        })

        cliente.on('newMessage', (Data)=> {
            setNewMessage({
                Message: Data.Message,
                Sender: Data.Sender,
                Time: new Date(Date.now())

            })
        })
    }, [])



    return(
    <React.Fragment>
        <Flex>
        <ChatsListContainer
             selectedChat={selectedChat}
             selectorChat={setSelectedChat}
             ChatClient={cliente}
        />
        <MainChatContainer
            getMessages={getMessages}
            setNewMessage={setNewMessage}
            ChatClient={cliente}
            CurrentUser={!nombre? '': nombre}
            selectedChat={selectedChat}
            selectorChat={setSelectedChat}
            cleanMessages={eraseMessages}
        />
        </Flex>
    </React.Fragment>
    )
}

export default Dashboard