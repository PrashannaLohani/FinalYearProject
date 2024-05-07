import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Progress,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowLeft, FaChartBar, FaUserGroup, FaTv } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export default function PollPresent() {
  return (
    <>
      <Box p={{ base: "1rem", md: "3rem", lg: "3rem" }} minHeight="100vh">
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
  return (
    <Box minH="100vh" borderRadius="2rem 0 0 2rem">
      <NavLink to="/Createpoll">
        <Button borderRadius="10rem">
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
        <Heading>123456</Heading>
      </Flex>
    </Box>
  );
};

const Main = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "#FFF9D0" : "#333333";

  return (
    <>
      <Box bgColor={bgColor} minH="100vh" borderRadius="0 2rem 2rem 0">
        <Heading p="2rem">What you doing Today?</Heading>
        <Divider />
        <Box p="2rem">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex gap="1rem" alignItems="center">
              <Text fontSize="3xl">1.</Text>
              <Text fontSize="3xl">Option 1</Text>
            </Flex>
            <Text fontSize="3xl">80%</Text>
          </Flex>

          <Progress
            colorScheme="green"
            value={80}
            mx="2rem"
            my="1rem"
            borderRadius="10px"
            h="1rem"
          />
        </Box>
      </Box>
    </>
  );
};
