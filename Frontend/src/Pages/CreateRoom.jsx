import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { Form } from "react-router-dom";

export default function CreateRoom() {
  return (
    <>
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
        <Box
          minH="100vh"
          borderRadius="2rem"
          boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
          minW="20rem"
          p="2rem"
        >
          <RoomForm />
          <hr />
          <JoinRoom />
        </Box>
      </Box>
    </>
  );
}

const RoomForm = () => {
  return (
    <>
      <Heading m="1rem">Create Room</Heading>
      <FormControl m="1rem">
        <Flex flexDir="column">
          <FormLabel>Room title:</FormLabel>
          <Input placeholder="Title" minW="10rem" maxW="20rem" isRequired />
          <FormLabel mt="1rem">Room code:</FormLabel>
          <Input
            placeholder="XXXXXX"
            minW="10rem"
            maxW="20rem"
            isRequired
            isReadOnly
          />
          <Button
            mt="1rem"
            maxW="10rem"
            bgColor="black"
            colorScheme="blackAlpha"
          >
            Create
          </Button>
        </Flex>
      </FormControl>
    </>
  );
};

const JoinRoom = () => {
  return (
    <>
      <Heading m="1rem">Join Room</Heading>
      <FormControl m="1rem">
        <Flex flexDir="column">
          <FormLabel>Enter room code:</FormLabel>
          <Input maxW="20rem" type="text" placeholder="XXXXXX" />
          <Button
            mt="2rem"
            maxW="10rem"
            bgColor="black"
            colorScheme="blackAlpha"
          >
            Enter
          </Button>
        </Flex>
      </FormControl>
    </>
  );
};
