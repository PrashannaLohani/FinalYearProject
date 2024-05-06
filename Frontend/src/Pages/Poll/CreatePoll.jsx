import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import PollBar from "./PollBar";

export default function CreatePoll() {
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
          <RoomID />
          <Question />
          <Flex alignItems="center" justifyContent="center">
            <Polling />
          </Flex>
        </Box>
      </Box>
    </>
  );
}

const RoomID = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Heading size="lg">Poll</Heading>
        <Flex flexDir="column">
          <Text>Number of People joined: </Text>
        </Flex>
      </Flex>
    </>
  );
};

const Question = () => {
  return (
    <>
      <Editable
        placeholder="Write your question"
        style={{ color: "grey", fontSize: "2.5rem" }}
        mt="2rem"
      >
        <EditablePreview />
        <EditableInput style={{ border: "1px solid grey" }} />
      </Editable>
    </>
  );
};

const Polling = () => {
  return (
    <>
      <>
        <Box minW="10rem" maxW="50rem" minHeight="100vh">
          <PollBar />
        </Box>
      </>
    </>
  );
};
