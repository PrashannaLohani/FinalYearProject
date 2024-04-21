import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";

export default function ParticipantRoom() {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const sendComment = async () => {
      const userToken = localStorage.getItem("User-Token");
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/room/Userinfo/",
          {
            token: userToken,
          }
        );
        setRoomCode(response.data.room);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendComment(); // Call the function to send the comment when the component mounts
  }, []);

  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <RoomCode roomCode={roomCode} />
      <Box
        minH="100vh"
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <RoomHeading />
        <CommentSection roomCode={roomCode} />
        <CommentInput roomCode={roomCode} />
      </Box>
    </Box>
  );
}

const RoomCode = ({ roomCode }) => {
  // Receive roomCode as a prop
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Room Code: {roomCode}</Heading>{" "}
        {/* Display the room code */}
      </Flex>
    </Box>
  );
};

const RoomHeading = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Heading size="lg">Comments and Questions</Heading>
      </Flex>
    </>
  );
};

const CommentSection = ({ roomCode }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/room/comments/"
        );
        setComments(response.data); // Assuming the response is an array of comments
        console.log(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []); // Fetch comments when the component mounts

  // Filter comments based on roomCode
  const filteredComments = comments.filter(
    (comment) => comment.room === roomCode
  );
  return (
    <Box mt="2rem" minH="100vh" p="2rem">
      <SimpleGrid
        columns={3}
        spacing="1rem"
        minChildWidth="400px"
        autoRows="auto"
      >
        {filteredComments.map((comment, index) => (
          <Card key={index} variant="outline" maxW="30rem" bgColor="#FFE6E6">
            <CardHeader>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Heading size="lg">{comment.user}</Heading>
                <Flex alignItems="center" gap="5px">
                  <Text as="b">Upvote:</Text>
                  <Button bgColor="black">
                    <FaHeart style={{ color: "white" }} />
                  </Button>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="md">{comment.message}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};
const CommentInput = ({ roomCode }) => {
  const [comment, setComment] = useState("");
  const username = localStorage.getItem("username");

  const handleSubmit = async () => {
    try {
      // Make a POST request to the backend to send the comment
      await axios.post("http://127.0.0.1:8000/room/comments/", {
        room: roomCode,
        user: username,
        message: comment,
      });

      // Reset the comment input after successful submission
      setComment("");

      // Optionally, you can trigger a refresh of the comments
      // or update the UI in response to the successful submission
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Flex gap="1rem" alignItems="center">
      <Input
        placeholder="Write Comments / Questions"
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <Button colorScheme="blackAlpha" bgColor="black" onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  );
};
