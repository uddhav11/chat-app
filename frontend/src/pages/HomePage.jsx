import React from "react";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from '../components/Login'
import Register from "../components/Register";

const HomePage = () => {

  const navigate= useNavigate()



  useEffect(() => {
    const userInfo= JSON.parse(localStorage.getItem('userInfo'))

    if (userInfo){
      navigate('/chats')
    }


  }, [navigate])


  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" color={"black"}>
          Chat app
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth={"1px"}
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
