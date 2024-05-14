import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function RoomPresenter() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomIdWithRoomName = searchParams.get("roomId");
  const roomId = roomIdWithRoomName.split("&")[0];

  useEffect(() => {}, [roomId]);

  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <RoomCode roomId={roomId} />
      <Box
        minH="100vh"
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <RoomHeading roomId={roomId} />
        <CommentSection roomId={roomId} />
      </Box>
    </Box>
  );
}

const RoomCode = ({ roomId }) => {
  const handleClick = () => {
    localStorage.removeItem("Roomtoken");
    localStorage.removeItem("username");
    window.location.href = "/info";
  };
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Room Code: {roomId} </Heading>
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleClick}
        >
          End session
        </Button>
      </Flex>
    </Box>
  );
};

const RoomHeading = ({ roomId }) => {
  const [numOfComments, setNumOfComments] = useState(0);
  const [numOfPeople, setNumOfPeople] = useState(0);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/room/comments-count/",
          { room_id: roomId }
        );
        setNumOfComments(response.data.num_of_comments);
        setNumOfPeople(response.data.num_of_people);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    fetchCommentsCount();

    return () => {
      // Cleanup if needed
    };
  }, [roomId]);

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Heading size="lg">Comments and Questions</Heading>
        <Flex flexDir="column">
          <Text>Number of People joined: {numOfPeople}</Text>
          <Text>Number of comments: {numOfComments}</Text>
        </Flex>
      </Flex>
    </>
  );
};

const CommentSection = ({ roomId }) => {
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

  const roomIdNumber = parseInt(roomId);

  // Filter comments based on roomId
  const filteredComments = comments.filter(
    (comment) => comment.room === roomIdNumber
  );

  const handleReadClick = (index) => {
    // Create a copy of the comments array
    const updatedComments = [...filteredComments];
    // Toggle the isRead property of the clicked comment
    updatedComments[index] = {
      ...updatedComments[index],
      isRead: !updatedComments[index].isRead,
    };
    // Update the state with the modified array
    setComments(updatedComments);
  };

  return (
    <Box mt="2rem" minH="100vh" p="2rem">
      <SimpleGrid
        columns={3}
        spacing="5px"
        minChildWidth={{ base: "200px", md: "400px" }}
        autoRows="auto"
      >
        {filteredComments.map((comment, index) => (
          <Card key={index} variant="outline" maxW="30rem" bgColor=" #A94D4A">
            <CardHeader>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Heading size="lg">{comment.user}</Heading>
                <Flex alignItems="center" gap="5px">
                  <Text as="b">Upvote:</Text>
                  <Text>#</Text>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text
                fontSize="md"
                style={{
                  textDecoration: comment.isRead ? "line-through" : "none",
                }}
              >
                {comment.message}
              </Text>
            </CardBody>
            <CardFooter>
              <Button
                colorScheme="blackAlpha"
                onClick={() => handleReadClick(index)}
                bgColor="black"
                color="white"
              >
                {comment.isRead ? "Unread" : "Read"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};
