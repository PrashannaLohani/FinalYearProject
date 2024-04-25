import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
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
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import RoomPresenter from "./Room_Presenter";

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
const RoomModal = ({ isOpen, onClose, roomId, roomName }) => {
  const handleMenuItemClick = () => {
    window.location.href = `/RoomPresenter?roomId=${roomId}&roomName=${roomName}`;
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
                {roomId}
              </Heading>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              bgColor="black"
              mr={3}
              onClick={() => handleMenuItemClick(<RoomPresenter />)}
            >
              Enter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const RoomForm = () => {
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Heading m="1rem">Create Room</Heading>
      <Formik
        initialValues={{
          roomTitle: "",
          numOfParticipants: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.roomTitle) {
            errors.roomTitle = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/room/createroom/",
              {
                room_name: values.roomTitle,
                limit_people_num: values.numOfParticipants,
              }
            );
            // Save JWT token to localStorage
            localStorage.setItem("Roomtoken", response.data.Roomtoken);
            setRoomId(response.data.ID);
            setRoomName(response.data.name);
            setIsModalOpen(true);
            console.log("Room created:", response.data);
          } catch (error) {
            console.error("Error creating room:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl m="1rem">
              <Flex flexDir="column">
                <FormLabel>Room title:</FormLabel>
                <Field name="roomTitle">
                  {({ field }) => (
                    <Input
                      {...field}
                      placeholder="Title"
                      minW="10rem"
                      maxW="20rem"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="roomTitle"
                  component="div"
                  style={{ color: "red" }}
                />

                <FormLabel mt="1rem">Number of participants:</FormLabel>
                <Field name="numOfParticipants">
                  {({ field }) => (
                    <>
                      <Input
                        {...field}
                        type="number"
                        minW="5rem"
                        maxW="10rem"
                      />
                      <FormHelperText>
                        If you don't want to put a limitation, leave it blank.
                      </FormHelperText>
                    </>
                  )}
                </Field>

                <Button
                  type="submit"
                  mt="1rem"
                  maxW="10rem"
                  bgColor="black"
                  colorScheme="blackAlpha"
                  isLoading={isSubmitting}
                >
                  Create
                </Button>
              </Flex>
            </FormControl>
          </Form>
        )}
      </Formik>
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={roomId}
        roomName={roomName}
      />
    </>
  );
};

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const toast = useToast();

  const handleEntry = () => {
    const successPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    toast.promise(successPromise, {
      success: { title: "Room Entered", description: "Welcome." },
      loading: { title: "Entering room...", description: "Please wait" },
      error: { title: "Login failed", description: "Something went wrong" },
    });
  };
  const handleInputChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoinClick = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/room/joinroom/",
        {
          room_code: roomCode,
        }
      );
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("User-Token", response.data.token);
      // Call handleEntry function or any other logic here if needed
      handleEntry();
      setTimeout(() => {
        window.location.href = "/ParticipantRoom";
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
            value={roomCode}
            onChange={handleInputChange}
          />
          <Button
            mt="2rem"
            maxW="10rem"
            bgColor="black"
            colorScheme="blackAlpha"
            onClick={handleJoinClick}
          >
            Enter
          </Button>
        </Flex>
      </FormControl>
    </>
  );
};
