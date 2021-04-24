import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { chatData, user } from "../types";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { useHistory } from "react-router";
import React from "react";

interface SidebarProps {
  selectedChat: chatData;
  selectorChat: React.Dispatch<React.SetStateAction<chatData>>;
  ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>;
  currentUser: user;
}

export const ChatsListContainer: React.FC<SidebarProps> = (props) => {
  return (
    <Flex w="20%" maxh="100%" h="100vh" direction="column" borderRight="1px">
      <SidebarHeader
        name={props.currentUser.nombre}
        ChatClient={props.ChatClient}
      />
      <SidebarContent>
        <ChatContentAdd />
        <ChatContentSearch />
        <Divider variant="solid" colorScheme="blackAlpha" />
        <Text fontSize="xl" textAlign="center">
          Mis salas de chat
        </Text>
        <SidebarItem
          nombreChat="publico"
          contador={21}
          selectedChat={props.selectedChat}
          selectorChat={props.selectorChat}
          ChatClient={props.ChatClient}
        />
        <SidebarItem
          nombreChat="La casona"
          contador={0}
          selectedChat={props.selectedChat}
          selectorChat={props.selectorChat}
          ChatClient={props.ChatClient}
        />
      </SidebarContent>
    </Flex>
  );
};

type headerProps = {
  name: string;
  ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>;
};
const SidebarHeader: React.FC<headerProps> = (props) => {
  const router = useHistory();
  function handleLogout() {
    localStorage.removeItem("qid");
    props.ChatClient.disconnect();
    router.push("/");
  }
  return (
    <Flex
      w="100%"
      h="8%"
      alignItems="center"
      px="1em"
      justifyContent="space-between"
    >
      <Menu>
        <MenuButton as={Avatar} aria-label="Options" variant="outline" />
        <MenuList>
          <MenuItem>Mi perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar sesion</MenuItem>
        </MenuList>
      </Menu>

      <Text fontSize="lg">{props.name}</Text>
    </Flex>
  );
};

const SidebarContent: React.FC = (props) => {
  return (
    <Box w="100%" h="92%" px=".5em">
      {props.children}
    </Box>
  );
};
type sidebarItemProps = {
  nombreChat: string;
  contador: number;
  selectedChat: chatData;
  selectorChat: React.Dispatch<React.SetStateAction<chatData>>;
  ChatClient: Socket<DefaultEventsMap, DefaultEventsMap>;
};
const SidebarItem: React.FC<sidebarItemProps> = (props) => {
  function handleClick(e: any) {
    e.preventDefault();
    if (props.selectedChat.nombre !== "") {
      alert(
        `Estas cambiando de sala de ${props.selectedChat.nombre} a ${props.nombreChat}`
      );
      props.selectorChat({
        id: "asd",
        nombre: props.nombreChat,
      });
      props.ChatClient.emit("Join-Chat", props.nombreChat);
      return;
    }

    alert(`Estas por unirte al chat ${props.nombreChat}`);
    props.selectorChat({
      id: "asd",
      nombre: props.nombreChat,
    });
    props.ChatClient.emit("Join-Chat", props.nombreChat);
  }
  return (
    <Flex
      bg="purple.300"
      my=".5em"
      as={Button}
      onClick={handleClick}
      w="100%"
      h="4rem"
      alignItems="center"
      borderRadius="lg"
      px="5px"
    >
      <Avatar name="Foto Prueba" src="https://bit.ly/broken-link" w="20%" />
      <Flex direction="column" w="80%" justify="center" alignItems="center">
        <Text>{props.nombreChat}</Text>
        <Text>Usuarios activos: {props.contador}</Text>
      </Flex>
    </Flex>
  );
};

const ChatContentSearch: React.FC = () => {
  return (
    <Button w="100%" colorScheme="red" my={2}>
      <SearchIcon mx="1em" />
      <Text>Entrar a un chat</Text>
    </Button>
  );
};
const ChatContentAdd: React.FC = () => {
  return (
    <Button w="100%" colorScheme="blue" my={2}>
      <AddIcon mx="1em" />
      <Text>Crear un chat</Text>
    </Button>
  );
};
// type ProfileDrawerProps = {};
// const MyProfileDrawer: React.FC<ProfileDrawerProps> = () => {
//   return <Text></Text>;
// };
