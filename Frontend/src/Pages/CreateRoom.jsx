import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
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
        <FormLabel>Room title:</FormLabel>
        <FormLabel>Room Type:</FormLabel>
        <FormLabel>##:</FormLabel>
        <FormLabel>Number of participants:</FormLabel>
        <FormLabel>Room code:</FormLabel>
        <Button mt="2rem" bgColor="black" colorScheme="blackAlpha">
          Create
        </Button>
      </FormControl>
    </>
  );
};

const JoinRoom = () => {
  return (
    <>
      <Heading m="1rem">Join Room</Heading>
      <FormControl m="1rem">
        <Flex alignItems="center">
          <FormLabel>Enter room code:</FormLabel>
          <Input maxW="20rem" type="text" placeholder="XXXXXX" />
        </Flex>
        <Button mt="2rem" bgColor="black" colorScheme="blackAlpha">
          Enter
        </Button>
      </FormControl>
    </>
  );
};
