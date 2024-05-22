import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useUserInfo } from "../Components/UserInfo";
import { FaPlus, FaChartSimple } from "react-icons/fa6";
import BarGraph from "../Components/BarGraph";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CreateRoom from "./Room/CreateRoom";
import CreatePoll from "./Poll/CreatePoll";
import axios from "axios";

export default function Info() {
  const userInfo = useUserInfo();
  const { full_name } = userInfo || {};
  return (
    <>
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
        <Box
          minH="100vh"
          borderRadius="2rem"
          boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
          minW="20rem"
          width="100%"
        >
          <Welcome full_name={full_name} />
          <Box pt="2rem">
            <Dashboard />
          </Box>
        </Box>
      </Box>
    </>
  );
}

const Welcome = ({ full_name }) => {
  const toast = useToast();
  const [quote, setQuote] = useState("");
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        setQuote(data.content);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    fetchQuote();
  }, []);
  const handlePoll = () => {
    const successPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
    toast.promise(successPromise, {
      success: { title: "Room Entered.", description: "Welcome." },
      loading: { title: "Creating Room...", description: "Please wait" },
      error: { title: "Failed", description: "Something went wrong" },
    });
  };
  const createPollCode = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:8000/Poll/createcode/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handlePoll();
      localStorage.setItem("Poll_Code", response.data.poll_id);
      setTimeout(() => {
        window.location.href = "/CreatePoll";
      }, 3000);

      console.log("Poll ID:", response.data.poll_id);
    } catch (error) {
      console.error("Error creating poll code:", error);
    }
  };

  return (
    <Box>
      <Box
        bgImage="../Image/Black.jpg"
        bgPosition="center"
        bgSize="cover"
        color="white"
        height="25rem"
        mt="2rem"
        borderRadius="2rem 2rem 5rem 0"
        p="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
      >
        <Heading size="xl">Dashboard</Heading>
        <Heading size="md" mt="1rem">
          Welcome {full_name} !
        </Heading>
        <Box mt="1rem" maxW="25%">
          <p>{quote}</p>
        </Box>
        <Flex gap="1rem" flexWrap="wrap">
          <NavLink to="/CreateRoom" element={<CreateRoom />}>
            <Button
              mt="2rem"
              leftIcon={<FaPlus />}
              colorScheme="whiteAlpha"
              color="white"
            >
              Create room
            </Button>
          </NavLink>

          <Button
            mt="2rem"
            leftIcon={<FaChartSimple />}
            colorScheme="whiteAlpha"
            color="white"
            onClick={createPollCode}
          >
            Create Poll
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <Box
      minH="auto"
      minW="10rem"
      mt="2rem"
      borderRadius="0 5rem 2rem 2rem"
      p={{ base: "1rem", md: "2rem" }}
      boxShadow="rgba(0, 0, 0, 0.25) 0px 14px 28px"
    >
      <Tabs>
        <TabList>
          <Tab>Room Dashboard</Tab>
          <Tab>Poll Dashboard</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <RoomDashboard />
          </TabPanel>
          <TabPanel>
            <PollDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const RoomDashboard = () => {
  const boxStyle = {
    style: {
      maxHeight: "auto",
      minHeight: "10rem",
      borderRadius: "2rem",
      bgColor: "white",
      padding: "2rem",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    },
  };

  const [totalRooms, setTotalRooms] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [participantsData, setParticipantsData] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [pollData, setPollData] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/room/stats/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalRooms(response.data.total_rooms);
      setRoomData(response.data.room_data);
      setParticipantsData(response.data.total_participants);
      setTotalComments(response.data.total_comments);
      setPollData(response.data.poll_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const groupedPollData = pollData.reduce((acc, poll) => {
    if (!acc[poll.poll]) {
      acc[poll.poll] = {};
    }
    if (!acc[poll.poll][poll.question]) {
      acc[poll.poll][poll.question] = [];
    }
    acc[poll.poll][poll.question].push({
      options: poll.options.split(","),
      votes: poll.votes,
    });
    return acc;
  }, {});

  return (
    <>
      <SimpleGrid
        minChildWidth={{ base: "120px", md: "200px", lg: "400px" }}
        columns={{ base: 1, md: 2 }}
        gap={4}
      >
        <Box key={1} {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total Rooms </Heading>
            <Text fontSize="2xl" mt="1rem">
              {totalRooms}
            </Text>
          </Flex>
        </Box>
        <Box key={2} {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total participants</Heading>
            <Text fontSize="2xl" mt="1rem">
              {participantsData}
            </Text>
          </Flex>
        </Box>
        <Box key={3} {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total Comments</Heading>
            <Text fontSize="2xl" mt="1rem">
              {totalComments}
            </Text>
          </Flex>
        </Box>

        <Box
          maxH="auto"
          minH="25rem"
          borderRadius="2rem"
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          key={4}
          gridColumn="span 2"
        >
          <Flex justifyContent="center" alignItems="center">
            <BarGraph />
          </Flex>
        </Box>
        <Box key={5} gridColumn={{ base: "auto", md: "span 1" }} {...boxStyle}>
          <Heading size="lg">Recent Rooms</Heading>
          <Accordion
            allowToggle
            mt="1rem"
            style={{ maxHeight: "300px", overflow: "auto" }}
          >
            {roomData &&
              roomData
                .slice(-6)
                .reverse()
                .map((room, index) => (
                  <AccordionItem key={index}>
                    <h2>
                      <AccordionButton>
                        <Box as="b" flex="1" textAlign="left">
                          {room.room_name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <p>Room ID: {room.room_id}</p>
                      <p>No. of People joined: {room.num_of_people}</p>
                      <p>No. of comments: {room.num_of_comments}</p>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
          </Accordion>
        </Box>
        <Box
          key={6}
          maxH="auto"
          minH="25rem"
          borderRadius="2rem"
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          gridColumn="span 3"
          p="2rem"
        >
          <Flex justifyItems="center" flexDir="column">
            <Heading size="lg">Poll History</Heading>
            <Accordion
              allowToggle
              mt="1rem"
              style={{ maxHeight: "300px", overflow: "auto" }}
            >
              {Object.keys(groupedPollData).map((roomId) => (
                <AccordionItem key={roomId}>
                  <h2>
                    <AccordionButton>
                      <Box as="b" flex="1" textAlign="left">
                        Room ID: {roomId}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {Object.keys(groupedPollData[roomId]).map((question) => (
                      <Box key={question} mb="1rem">
                        <Text fontWeight="bold">Question: {question}</Text>
                        {groupedPollData[roomId][question].map(
                          (optionData, idx) => (
                            <Box key={idx}>
                              {optionData.options.map((option, i) => (
                                <Text key={i}>
                                  Option {i + 1}: {option} - Votes:{" "}
                                  {optionData.votes}
                                </Text>
                              ))}
                            </Box>
                          )
                        )}
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Flex>
        </Box>
      </SimpleGrid>
    </>
  );
};

const PollDashboard = () => {
  const [data, setData] = useState({
    total_polls: 0,
    total_votes: 0,
    poll_data: [],
  });
  const [loading, setLoading] = useState(true);
  const boxStyle = {
    style: {
      maxHeight: "auto",
      minHeight: "10rem",
      borderRadius: "2rem",
      bgColor: "white",
      padding: "2rem",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/Poll/stats/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const groupedPollData = data.poll_data.reduce((acc, poll) => {
    if (!acc[poll.poll]) {
      acc[poll.poll] = {};
    }
    if (!acc[poll.poll][poll.question]) {
      acc[poll.poll][poll.question] = [];
    }
    acc[poll.poll][poll.question].push({
      options: poll.options,
      votes: poll.votes,
    });
    return acc;
  }, {});

  return (
    <SimpleGrid
      minChildWidth={{ base: "120px", md: "200px", lg: "300px" }}
      Columns={2}
      gap={4}
    >
      <Box key={1} {...boxStyle} gridColumn="span 2">
        <Flex justifyItems="center" alignItems="center" flexDir="column">
          <Heading size="lg">Total Poll Rooms</Heading>
          <Text fontSize="2xl" mt="1rem">
            {loading ? "Loading..." : data.total_polls}
          </Text>
        </Flex>
      </Box>
      <Box key={2} {...boxStyle} gridColumn="span 2">
        <Flex justifyItems="center" alignItems="center" flexDir="column">
          <Heading size="lg">Total Voting</Heading>
          <Text fontSize="2xl" mt="1rem">
            {loading ? "Loading..." : data.total_votes}
          </Text>
        </Flex>
      </Box>
      <Box
        key={3}
        maxH="auto"
        minH="25rem"
        borderRadius="2rem"
        boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        gridColumn="span 4"
        p="2rem"
      >
        <Flex justifyItems="center" flexDir="column">
          <Heading size="lg">History</Heading>
          <Accordion
            allowToggle
            mt="1rem"
            style={{ maxHeight: "300px", overflow: "auto" }}
          >
            {Object.keys(groupedPollData).length > 0 ? (
              Object.keys(groupedPollData).map((pollId, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box as="b" flex="1" textAlign="left">
                        Poll ID: {pollId}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {Object.keys(groupedPollData[pollId]).map((question, i) => (
                      <div key={i}>
                        <p>
                          <strong>Question:</strong>
                          {question}
                        </p>
                        {groupedPollData[pollId][question].map((option, j) => (
                          <p key={j}>
                            Option {j + 1}: {option.options} (Votes:{" "}
                            {option.votes})
                          </p>
                        ))}
                      </div>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))
            ) : (
              <Text>No poll data available</Text>
            )}
          </Accordion>
        </Flex>
      </Box>
    </SimpleGrid>
  );
};
