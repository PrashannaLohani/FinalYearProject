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
  Text,
} from "@chakra-ui/react";

import { useUserInfo } from "../Components/UserInfo";
import { FaPlus } from "react-icons/fa6";
import BarGraph from "../Components/BarGraph";
import { useEffect, useState } from "react";

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
        <Button mt="2rem" leftIcon={<FaPlus />} colorScheme="whiteAlpha">
          Create room
        </Button>
      </Box>
    </Box>
  );
};

const Dashboard = () => {
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
    <Box
      minH="100vh"
      minW="10rem"
      mt="2rem"
      borderRadius="0 5rem 2rem 2rem"
      p={{ base: "1rem", md: "3rem" }}
      boxShadow="rgba(0, 0, 0, 0.25) 0px 14px 28px"
    >
      <SimpleGrid
        minChildWidth="200px"
        // templateColumns="repeat(3, 1fr)"
        gap={4}
      >
        <Box {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total Rooms created:</Heading>
            <Text fontSize="2xl" mt="1rem">
              24
            </Text>
          </Flex>
        </Box>
        <Box {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total participants:</Heading>
            <Text fontSize="2xl" mt="1rem">
              300
            </Text>
          </Flex>
        </Box>
        <Box {...boxStyle}>
          <Flex justifyItems="center" alignItems="center" flexDir="column">
            <Heading size="lg">Total Comments:</Heading>
            <Text fontSize="2xl" mt="1rem">
              246
            </Text>
          </Flex>
        </Box>
        <Box
          maxH="10rem"
          minH="25rem"
          bgColor="white"
          gridColumn="1 / span 2"
          borderRadius="2rem"
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        >
          <BarGraph />
        </Box>
        <Box {...boxStyle}>
          <Heading size="lg">Recent Rooms:</Heading>
          <Accordion
            allowToggle
            mt="1rem"
            style={{ maxHeight: "300px", overflow: "auto" }}
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Room Title:
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} gap="1rem">
                <p> Room ID:</p>
                <p> No. of People joined:</p>
                <p> No. of comments:</p>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
