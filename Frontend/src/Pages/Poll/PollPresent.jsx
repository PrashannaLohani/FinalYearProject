import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaChartBar, FaUserGroup, FaTv } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

import PollBargraph from "./Components/PollBargraph";
import axios from "axios";

export default function PollPresent() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    const storedQuestions = localStorage.getItem("pollQuestions");
    const parsedQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];
    setQuestions(parsedQuestions);

    if (parsedQuestions.length > 0) {
      setSelectedQuestion(parsedQuestions[0].question);
    }
  }, []);

  return (
    <>
      <Box p={{ base: "1rem", md: "2rem", lg: "2rem" }} minHeight="auto">
        <Grid templateColumns="1fr 3fr" templateRows="auto 1fr">
          {/* Headline in the first row and second column */}
          <GridItem colSpan={1} colStart={2}>
            <Headline />
          </GridItem>
          {/* Sidebar and Main in the second row */}
          <GridItem>
            <Sidebar
              questions={questions}
              onQuestionSelect={setSelectedQuestion}
            />
          </GridItem>
          <GridItem>
            <Main selectedQuestion={selectedQuestion} />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}

const Headline = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handlePresentClick = () => {
    if (!isFullscreen) {
      if (document.fullscreenEnabled) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Full-screen mode is not supported
        console.error("Full-screen mode is not supported.");
      }
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollCode = localStorage.getItem("Poll_Code");
        const response = await axios.get(
          "http://127.0.0.1:8000/Poll/totaluser/",
          {
            params: {
              poll_id: pollCode,
            },
          }
        );
        setPollData(response.data.num_of_people);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Box p={{ base: "1rem", lg: "2rem" }}>
      <Flex alignItems="center" justifyContent="space-between" fontSize="xl">
        <Flex gap="5px" alignItems="center">
          <FaChartBar />
          <Text>Active Poll</Text>
        </Flex>
        <Flex gap="5px" alignItems="center">
          <Text>{pollData}</Text>
          <FaUserGroup />
          <Button ml="2rem" onClick={handlePresentClick}>
            <FaTv />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

const Sidebar = ({
  questions = [],
  onQuestionSelect,
  selectedQuestion,
  pollCode,
}) => {
  const handleBackButtonClick = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const PollCode = localStorage.getItem("Poll_Code");

  return (
    <Box minH="100vh" borderRadius="2rem 0 0 2rem">
      <NavLink to="/Createpoll">
        <Button borderRadius="10rem" onClick={handleBackButtonClick}>
          <FaArrowLeft />
        </Button>
      </NavLink>
      <Flex
        h="100%"
        textAlign="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Text>Join at</Text>
        <Heading>React&Rise.com</Heading>
        <Heading>{PollCode}</Heading>
      </Flex>
      <Divider mt="4rem" />
      {questions.map((q, index) => (
        <React.Fragment key={index}>
          <Button
            minW="100%"
            variant={selectedQuestion === q.question ? "solid" : "ghost"}
            colorScheme={selectedQuestion === q.question ? "blue" : "gray"}
            onClick={() => onQuestionSelect(q.question)}
            textAlign="left"
          >
            {q.question}
          </Button>
          <Divider />
        </React.Fragment>
      ))}
    </Box>
  );
};
const Main = ({ selectedQuestion }) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "#FFF9D0" : "#333333";

  return (
    <>
      <Box bgColor={bgColor} minH="100vh" borderRadius="0 2rem 2rem 0">
        <Heading p="2rem">{selectedQuestion}</Heading>

        <Tabs>
          <TabList>
            <Tab>Bar Graph</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <PollBargraph question={selectedQuestion} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};
