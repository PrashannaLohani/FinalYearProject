import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { FaChartBar, FaTv, FaPlus, FaTrashCan } from "react-icons/fa6";

export default function RoomPresenter() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomIdWithRoomName = searchParams.get("roomId");
  const roomId = roomIdWithRoomName.split("&")[0];

  useEffect(() => {}, [roomId]);

  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <RoomCode roomId={roomId} />
    </Box>
  );
}

const RoomCode = ({ roomId }) => {
  const handleClick = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/room/deactivate/", {
        room_id: roomId,
        active: false,
      });

      // After successfully setting the session to true, remove items from localStorage and redirect
      localStorage.removeItem("Roomtoken");
      localStorage.removeItem("username");
      localStorage.removeItem("pollQuestions");
      localStorage.removeItem("RoomName");
      window.location.href = "/info";
    } catch (error) {
      console.error("Error ending session:", error);
    }
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
      <Tabs size="md" variant="soft-rounded" colorScheme="whiteAlpha">
        <TabList p="1rem">
          <Tab>Comment</Tab>
          <Tab> Create Poll</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CommentSection roomId={roomId} />
          </TabPanel>
          <TabPanel>
            <PollSection roomId={roomId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const CommentSection = ({ roomId }) => {
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
    <>
      <Box
        minH="100vh"
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
          <Flex flexDir="column">
            <Text>Number of People joined: {numOfPeople}</Text>
            <Text>Number of comments: {numOfComments}</Text>
          </Flex>
        </Flex>
        <Box mt="2rem" minH="100vh" p="2rem">
          <SimpleGrid
            columns={3}
            spacing="5px"
            minChildWidth={{ base: "200px", md: "400px" }}
            autoRows="auto"
          >
            {filteredComments.map((comment, index) => (
              <Card
                key={index}
                variant="outline"
                maxW="30rem"
                bgColor=" #A94D4A"
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
                      <Text>{comment.vote}</Text>
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
      </Box>
    </>
  );
};

const PollSection = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("pollQuestions")) || [
      { question: "", options: ["Option 1", "Option 2"] },
    ]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("pollQuestions", JSON.stringify(questions));
  }, [questions]);

  const handlePresentClick = () => {
    if (!isFullscreen) {
      if (document.fullscreenEnabled) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        console.error("Full-screen mode is not supported.");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleQuestionChange = (newValue, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question = newValue;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (newValue, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = newValue;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < 8) {
      newQuestions[questionIndex].options.push(
        `Option ${newQuestions[questionIndex].options.length + 1}`
      );
      setQuestions(newQuestions);
    }
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["Option 1", "Option 2"] },
    ]);
  };

  const deleteQuestion = (questionIndex) => {
    const newQuestions = questions.filter(
      (_, index) => index !== questionIndex
    );
    setQuestions(newQuestions);
  };

  const Roomid = localStorage.getItem("Roomtoken");
  const submitPoll = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/room/options/", {
        poll: Roomid,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
        })),
      });
      PresentationClick();
    } catch (error) {
      console.error("Error submitting poll:", error.response || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        minH="100vh"
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
          <Heading size="lg">
            <Flex alignItems="center" gap="1rem">
              <FaChartBar /> <Text>Ranking</Text>
            </Flex>
          </Heading>
          <NavLink to="/RoomPollPresent">
            <Button leftIcon={<FaTv />} onClick={handlePresentClick}>
              Present
            </Button>
          </NavLink>
        </Flex>

        <Box minHeight="auto">
          {questions.map((q, questionIndex) => (
            <Box key={questionIndex} mb="2rem">
              <Editable
                placeholder="Write your question"
                value={q.question}
                style={{ fontSize: "2.5rem" }}
                mt="2rem"
                onChange={(newValue) =>
                  handleQuestionChange(newValue, questionIndex)
                }
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
              {q.options.map((option, optionIndex) => (
                <Flex
                  alignItems="center"
                  gap="1rem"
                  mt="2rem"
                  key={optionIndex}
                >
                  <Text>{optionIndex + 1}.</Text>
                  <Editable
                    placeholder={`Option ${optionIndex + 1}`}
                    defaultValue={option}
                    onChange={(newValue) =>
                      handleOptionChange(newValue, questionIndex, optionIndex)
                    }
                    minW="80%"
                    border="1px"
                    borderRadius="9px"
                    borderColor="gray.200"
                  >
                    <EditablePreview p="1rem" />
                    <EditableInput p="1rem" />
                  </Editable>
                  {optionIndex >= 2 && (
                    <Button
                      variant="unstyled"
                      ml="1rem"
                      onClick={() => deleteOption(questionIndex, optionIndex)}
                    >
                      <FaTrashCan />
                    </Button>
                  )}
                </Flex>
              ))}
              <Flex alignItems="center" gap="5px">
                <Button
                  leftIcon={<FaPlus />}
                  variant="ghost"
                  border="1px"
                  borderColor="green.500"
                  color="gray"
                  mt="1rem"
                  onClick={() => addOption(questionIndex)}
                >
                  Add option
                </Button>
                {questions.length > 1 && (
                  <Button
                    leftIcon={<FaTrashCan />}
                    color="white"
                    _hover={{ color: "black", bgColor: "teal" }}
                    bgColor="black"
                    mt="1rem"
                    onClick={() => deleteQuestion(questionIndex)}
                  >
                    Delete Question
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
          <Flex gap="1rem">
            <NavLink to="/RoomPollPresent">
              <Button
                colorScheme="blackAlpha"
                color="white"
                mt="1rem"
                bgColor="black"
                onClick={submitPoll}
                isDisabled={isSubmitting}
              >
                Submit
              </Button>
            </NavLink>
            <Button
              leftIcon={<FaPlus />}
              variant="ghost"
              border="1px"
              borderColor="green.500"
              color="gray"
              mt="1rem"
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
