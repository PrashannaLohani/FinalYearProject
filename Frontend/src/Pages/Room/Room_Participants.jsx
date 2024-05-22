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
  Spacer,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import Navbar from "../../Layout/Navbar";
import PollParticipant from "./RoomPollParticipants";

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

  const accessToken = localStorage.getItem("accessToken");
  return (
    <>
      {accessToken ? <Navbar /> : <NavbarWithoutLogin />}
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
        <RoomCode roomCode={roomCode} />
      </Box>
    </>
  );
}

const NavbarWithoutLogin = () => {
  const userName = localStorage.getItem("username");
  return (
    <>
      <Box px="1rem">
        <Flex margin="1rem" flexWrap="wrap" alignItems="center">
          <Box display="flex" alignItems="center">
            <Image
              width="100%"
              height="50px"
              objectFit="cover"
              src="./Image/React&Rise_Logo.png"
            />
            <Image
              width="100%"
              height="40px"
              objectFit="cover"
              src="./Image/React&Rise_Text.png"
            />
          </Box>

          <Spacer />
          <Flex gap="1rem" flexWrap="wrap">
            <Text fontSize="lg">Your Name for this session : {userName}</Text>
          </Flex>
        </Flex>
      </Box>
      <hr />
    </>
  );
};

const RoomCode = ({ roomCode }) => {
  const handleEndSession = () => {
    const accessToken = localStorage.getItem("accessToken");
    localStorage.getItem("RoomID");
    localStorage.getItem("username");

    if (accessToken) {
      window.location.href = "/info";
    } else {
      window.location.href = "/";
    }
  };
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Room Code: {roomCode}</Heading>{" "}
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleEndSession}
        >
          Exit
        </Button>
      </Flex>
      <Tabs size="md" variant="soft-rounded" colorScheme="blackAlpha">
        <TabList p="1rem">
          <Tab>Comment</Tab>
          <Tab>Poll</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CommentSection roomCode={roomCode} />
          </TabPanel>
          <TabPanel>
            <PollParticipant />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
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
  const handleUpvote = async (roomId, message) => {
    try {
      await axios.post("http://127.0.0.1:8000/room/upvote/", {
        room_id: roomId,
        message: message,
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };
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
    <>
      <Box
        minH="auto"
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Heading size="lg">Comments and Questions</Heading>
        </Flex>
        <Box mt="2rem" minH="50vh" p="2rem">
          <SimpleGrid
            columns={3}
            spacing="1rem"
            minChildWidth={{ base: "200px", md: "400px" }}
            autoRows="auto"
          >
            {filteredComments.map((comment, index) => (
              <Card
                key={index}
                variant="outline"
                maxW="30rem"
                bgColor="#7AB2B2"
              >
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
                        <FaHeart
                          style={{ color: "white" }}
                          onClick={() =>
                            handleUpvote(comment.room, comment.message)
                          }
                        />
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
        <Flex gap="1rem" alignItems="center">
          <Input
            placeholder="Write Comments / Questions"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button
            colorScheme="blackAlpha"
            bgColor="black"
            onClick={handleSubmit}
            color="white"
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </>
  );
};
