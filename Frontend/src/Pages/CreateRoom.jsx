import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { useState } from "react";

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
const RoomModal = ({ isOpen, onClose }) => {
  const handleMenuItemClick = (targetPage) => {
    window.location.href = targetPage;
  };
  return (
    <>
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room Created</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex alignItems="center" justifyContent="center" flexDir="column">
              <Heading size="lg">Your Room Code:</Heading>
              <Heading size="2xl" mt="1rem">
                123456
              </Heading>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              bgColor="black"
              mr={3}
              onClick={() => handleMenuItemClick("#")}
            >
              Enter
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const RoomForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateButtonClick = () => {
    // Open the modal
    setIsModalOpen(true);
  };
  return (
    <>
      <Heading m="1rem">Create Room</Heading>
      <FormControl m="1rem">
        <Flex flexDir="column">
          <FormLabel>Room title:</FormLabel>
          <Input placeholder="Title" minW="10rem" maxW="20rem" isRequired />
          <FormLabel mt="1rem">Number of participants:</FormLabel>
          <Input type="number" minW="5rem" maxW="10rem" isRequired />
          <FormLabel mt="1rem">Room code:</FormLabel>
          <Input
            placeholder="XXXXXX"
            minW="10rem"
            maxW="20rem"
            isRequired
            isReadOnly
          />
          <Button
            onClick={handleCreateButtonClick} // Open modal on button click
            mt="1rem"
            maxW="10rem"
            bgColor="black"
            colorScheme="blackAlpha"
          >
            Create
          </Button>
        </Flex>
      </FormControl>
      <RoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
          <Input
            maxW="20rem"
            type="number"
            maxLength={6}
            placeholder="XXXXXX"
          />
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
