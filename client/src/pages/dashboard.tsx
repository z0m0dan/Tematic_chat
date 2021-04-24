import React, { useEffect, useState } from 'react'
import { MainChatContainer } from '../components/ChatBody'
import { ChatsListContainer } from '../components/ChatListContainer'
import { Flex } from '@chakra-ui/react'
import { chatData, Message, user } from '../types'
import { io } from 'socket.io-client'
import { useHistory } from 'react-router'


const cliente = io('http://localhost:5000')

const Dashboard = () => {
    const [getMessages, setMessages] = useState(new Array<Message>())
    const [selectedChat, setSelectedChat] = useState<chatData>({id:'', nombre:''})
    const [currentUser, setCurrentUser] = useState<user>({
        username:'',
        nombre:''
    })
    const router = useHistory()
    const setNewMessage = (Message: Message) => {
        setMessages(Messages => [...Messages, Message])
    }
    const eraseMessages = () => {
        setMessages(new Array<Message>())
    }


   
    useEffect(()=> {
        fetch('http://localhost:5000/auth/me',
    {
        headers:{
            "Authorization": 'Bearer '+localStorage.getItem('qid')
        }
    }).then(res=> res.json())
        .then(data => {
            setCurrentUser({
            nombre: data.name,
            username: data.username
        })
        cliente.emit('Register', data.name)
        }
        ).catch(error => alert(error))
       
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

    if(!localStorage.getItem('qid'))
         router.push('/')
    return(
    <React.Fragment>
        <Flex>
        <ChatsListContainer
             selectedChat={selectedChat}
             selectorChat={setSelectedChat}
             ChatClient={cliente}
             currentUser={currentUser}
        />
        <MainChatContainer
            getMessages={getMessages}
            setNewMessage={setNewMessage}
            ChatClient={cliente}
            CurrentUser={currentUser}
            selectedChat={selectedChat}
            selectorChat={setSelectedChat}
            cleanMessages={eraseMessages}
        />
        </Flex>
    </React.Fragment>
    )
}

export default Dashboard