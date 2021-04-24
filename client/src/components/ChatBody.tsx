import {  Avatar, Flex, Icon, Text, 
    IconButton, Spacer, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box, Input, Button,
    HStack
     } from '@chakra-ui/react'
import { useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import { chatData, Message, user } from '../types'


interface MainChatContainerProps { 
    getMessages: Message[]
    setNewMessage: (Message: Message) => void
    ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>
    CurrentUser: user
    selectedChat: chatData 
    selectorChat: React.Dispatch<React.SetStateAction<chatData>>
    cleanMessages: () => void
}

export const MainChatContainer: React.FC<MainChatContainerProps> = (props) => {
    if(props.selectedChat.nombre==='')

    return(
        <Flex w='80%' maxW='80%' maxH='100vh' justifyContent='center' alignItems='center'>
            <Text fontSize='3xl' fontWeight='bold' color='blue.600'>No estás en ninguna sala, ingresa a una en el panel de la izquierda :)</Text>
        </Flex>
    )

    return (
        <Flex direction='column' w='80%' maxW='80%' maxH='100vh'>
            <TitleBarChat
               selectedChat={props.selectedChat}
                selectorChat={props.selectorChat}
                ChatClient={props.ChatClient}
                cleanMessages={props.cleanMessages}
            />
            <MessageContainer>
                {props.getMessages.length>0? props.getMessages.reverse().map(item => {
                  return <MessageBox
                        key={item.Time.getUTCMilliseconds()}
                        Message={item.Message}
                        Sender={item.Sender}
                        Time={item.Time}
                        isMe={props.CurrentUser.nombre===item.Sender ? true: false}
                   />
                }) : 
                    <NotificationMessage Message='Aun no hay ningun mensaje escrito, Esscribe uno!'/>
                }
               
            </MessageContainer>
            <MessageContainerInput
                setNewMessage={props.setNewMessage}
                ChatClient={props.ChatClient}
                selectedChat={props.selectedChat}
            />
        </Flex>
    )
}

type TitleBarProps = {
    selectedChat: chatData 
    selectorChat: React.Dispatch<React.SetStateAction<chatData>>
    ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>
    cleanMessages: () => void
}
const TitleBarChat: React.FC<TitleBarProps> = (props) => {

    function handleCloseChat(e: any) {
        e.preventDefault()
        props.selectorChat({
            id:'',
            nombre:''
        })
        props.cleanMessages()
        props.ChatClient.emit('left-chat', props.selectedChat.nombre)
    }

    return (
        <Flex borderBottom='1px' w='100%' h='8%' align='center'>
            <Avatar name='Funcion Prueba' src='http://asdasd.asdad ' 
                mx='2em'
            />
            <Text>{props.selectedChat.nombre}</Text>
            <Spacer/>
            <Box mr='2em'
            >             
                <Menu >
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<Icon as={MdMoreVert}  w={7} h={7} />}
                        variant="outline"
                        
                    />
                    <MenuList>
                        <MenuItem  >
                        Informacion del chat
                        </MenuItem>
                        <MenuItem  onClick={handleCloseChat}>
                        Salir del chat actual
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
          
        </Flex>
    )
}

const MessageContainer: React.FC = (props) => {
    return(
    <Flex bg='lavender' justify='flex-end'
        direction='column' w='100%' h='83%' overflowY='auto' overflowX='hidden'>
        {props.children}
    </Flex>
    )
}
type propsInput = {
    setNewMessage: (Message: Message) => void
    ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>
    selectedChat: chatData 

}
const MessageContainerInput: React.FC<propsInput> = (props) => {

    const [value, setValue] = useState('')

    const handleChange = (event: any) => setValue(event.target.value)

    function handleSubmit(event:any) {
        event.preventDefault()
        setValue('')
        props.ChatClient.emit('Message', value, props.selectedChat.nombre)
    }
    return (
        <Flex h='8%' py='1em' alignItems='center'>

                <Input variant="outline" placeholder="Escribe un mensaje..." h='100%' value={value}
                    onChange={handleChange}
                />
                <Button type='submit'  colorScheme='messenger' onClick={handleSubmit}>Enviar</Button>

        </Flex>
    )
}

interface MessagePropsUser  {
    Message: string
    Sender: string
    Time: Date
    isMe: boolean

}

const MessageBox: React.FC<MessagePropsUser> = (props) => {

    if(props.Sender==='SERVER')
    return (
        <Flex w='100%' h='2em'  justify='center' my={2}>
            <Flex w='50%' bg='silver' justifyContent='center' borderRadius='xl' alignItems='center'>
                <Text fontWeight='bold' fontFamily='revert' >{props.Message}</Text>
            </Flex>
        </Flex>
    )

    if(!props.isMe)
    return(
        <Flex  w='40%'  mx={3} my={5} direction='column'>
            <Box bg='blue.600' padding={4} borderRadius='2xl' px={5} >
                <Text fontFamily='monospace' fontSize='xl' color='whiteAlpha.900'>{props.Message}</Text>
            </Box>
            <HStack mx={4} >
                <Text fontFamily='serif' fontSize='md'>{props.Sender}</Text>
                <Text fontFamily='serif' fontSize='sm'>{`${props.Time.getHours()}:${props.Time.getMinutes()}`}</Text>
            </HStack>
        </Flex>
    )

    return(
        <Flex  maxW='100%'  mx={3} my={5} direction='row-reverse' >
            <Flex direction='column' w='40%'>
                <Box bg='green.600' padding={4} borderRadius='2xl' px={5} >
                <Text fontFamily='monospace' fontSize='xl' color='whiteAlpha.900'>{props.Message}</Text>
                </Box>
                <HStack mx={4} w='100%' direction='column-reverse'>
                <Text fontFamily='serif' fontSize='md'>Tú</Text>
                <Text fontFamily='serif' fontSize='sm'>{`${props.Time.getHours()}:${props.Time.getMinutes()}`}</Text>
                </HStack>
            </Flex>
          
        </Flex>
    )
}

interface NotificacionMessageProps {
    Message: string
}

const NotificationMessage: React.FC<NotificacionMessageProps> = (props)=>{
    return (
        <Flex w='100%' h='2em'  justify='center' my={2}>
            <Flex w='50%' bg='silver' justifyContent='center' borderRadius='xl' alignItems='center'>
                <Text fontWeight='bold' fontFamily='revert' >{props.Message}</Text>
            </Flex>
        </Flex>
    )
}