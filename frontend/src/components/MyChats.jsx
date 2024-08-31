import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:4000/api/chat",
        config
      );
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
    display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      color="black"
    >
      Chats
      <GroupChatModal>
        <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
      >
        Create New Group
      </Button>
      </GroupChatModal>
      
    </Box>

    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflow="hidden"
    >
      {chats ? (
        <Stack overflowY="scroll">
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={SelectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  </Box>
  );
};

export default MyChats;
