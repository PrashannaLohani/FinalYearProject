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
          <NavLink to="/CreatePoll" element={<CreatePoll />}>
            <Button
              mt="2rem"
              leftIcon={<FaChartSimple />}
              colorScheme="whiteAlpha"
              color="white"
            >
              Create Poll
            </Button>
          </NavLink>
        </Flex>
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <Box
      minH="100vh"
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <SimpleGrid minChildWidth="300px" Columns={{ base: 1, md: 2 }} gap={4}>
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
          bgColor="white"
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
      </SimpleGrid>
    </>
  );
};

const PollDashboard = () => {
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
  return (
    <SimpleGrid
      minChildWidth={{ base: "120px", md: "200px", lg: "300px" }}
      Columns={2}
      gap={4}
    >
      <Box key={1} {...boxStyle} gridColumn="span 2">
        <Flex justifyItems="center" alignItems="center" flexDir="column">
          <Heading size="lg">Total Poll Rooms </Heading>
          <Text fontSize="2xl" mt="1rem">
            20
          </Text>
        </Flex>
      </Box>
      <Box key={2} {...boxStyle} gridColumn="span 2">
        <Flex justifyItems="center" alignItems="center" flexDir="column">
          <Heading size="lg">Total Voting</Heading>
          <Text fontSize="2xl" mt="1rem">
            20
          </Text>
        </Flex>
      </Box>
      <Box
        key={3}
        maxH="auto"
        minH="25rem"
        bgColor="white"
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
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="b" flex="1" textAlign="left">
                    Room ID:
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <p>Question: </p>
                <p>Total vote: </p>
                <p>Option 1: </p>
                <p>Option 2: </p>
                <p>Option 3: </p>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
      </Box>
    </SimpleGrid>
  );
};
