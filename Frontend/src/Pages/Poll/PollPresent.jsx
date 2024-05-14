import {
  Box,
  Button,
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
import { useState } from "react";
import { FaArrowLeft, FaChartBar, FaUserGroup, FaTv } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import PollProgressBar from "./Components/PollProgressBar";
import PollBargraph from "./Components/PollBargraph";

export default function PollPresent() {
  return (
    <>
      <Box p={{ base: "1rem", md: "2rem", lg: "2rem" }} minHeight="auto">
        <Grid templateColumns="1fr 3fr" templateRows="auto 1fr">
          {/* Sidebar and Main in the second row */}
          <GridItem colSpan={1} colStart={2}>
            <Headline />
          </GridItem>
          <GridItem>
            <Sidebar />
          </GridItem>
          <GridItem>
            <Main />
          </GridItem>
          {/* Headline in the first row and second column */}
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
  return (
    <Box p="1rem">
      <Flex alignItems="center" justifyContent="space-between" fontSize="xl">
        <Flex gap="5px" alignItems="center">
          <FaChartBar />
          <Text>Active Poll</Text>
        </Flex>
        <Flex gap="5px" alignItems="center">
          <Text>2</Text>
          <FaUserGroup />
          <Button ml="2rem" onClick={handlePresentClick}>
            <FaTv />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

const Sidebar = () => {
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
        alignItems="center"
      >
        <Text>Join at</Text>
        <Heading>React&Rise.com</Heading>
        <Heading>{PollCode}</Heading>
      </Flex>
    </Box>
  );
};

const Main = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "#FFF9D0" : "#333333";

  const Question = localStorage.getItem("question");

  return (
    <>
      <Box bgColor={bgColor} minH="100vh" borderRadius="0 2rem 2rem 0">
        <Heading p="2rem">{Question}</Heading>

        <Tabs>
          <TabList>
            <Tab>Bar Graph</Tab>
            <Tab>Progress Bar</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <PollBargraph />
            </TabPanel>
            <TabPanel>
              <PollProgressBar />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};
