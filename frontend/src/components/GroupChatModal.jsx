import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeitem from "../userAvatar/UserBadgeitem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gropuChatName, setGropuChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom-left",
      });
      return;
    }
  };

  const handleSubmit = async () => {
    if (!gropuChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        duration: 5000,
        isClosable: true,
        status: "warning",
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/chat/group",
        {
          name: gropuChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat created",
        duration: 5000,
        isClosable: true,
        status: "success",
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to create a chat! ",
        description: "no gone well",
        duration: 5000,
        isClosable: true,
        status: "error",
        position: "bottom-left",
      });
      return;
    }
  };

  const handleDelete = (userToBeDeleted) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToBeDeleted._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} d="flex" justifyContent={"center"}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGropuChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg:- ray, jhon, dude"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* showing the selected users */}
            <Box display={"flex"}>
              {selectedUsers.map((u) => (
                <UserBadgeitem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* showing the searched users */}
            {loading ? (
              <p>Loading</p>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
