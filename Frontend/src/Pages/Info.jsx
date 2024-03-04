import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import BarChart from "../Components/BarGraph";
import { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./Profile";

export default function Info() {
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get("http://127.0.0.1:8000/info/", config);

      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  return (
    <>
      <Box minH="100vh" p="4rem">
        <Flex justifyContent="center" align="center">
          <Box>
            <Section1 fullName={userInfo ? userInfo.full_name : ""} />
          </Box>
        </Flex>
        <Section2 fullName={userInfo ? userInfo.full_name : ""} />
        <hr />
        <Section3 />
        <Section4 />
        <Section5 />
      </Box>
    </>
  );
}

const Section1 = ({ fullName }) => {
  return (
    <>
      <Box textAlign="center" my="4em">
        <Heading>Welcome {fullName}!</Heading>
        <Text mt="1rem">Manage your room and profile</Text>
        <Button mt="1rem" colorScheme="blackAlpha" bgColor="black">
          Create Room
        </Button>
      </Box>
    </>
  );
};

const Section2 = ({ fullName }) => {
  return (
    <>
      <Box textAlign="left" mb="2rem" mt="2rem" ml="2rem">
        <Flex gap="1rem" align="center">
          <Avatar size="lg" name="Profile" />
          <Flex flexDir="column" gap="0.5rem">
            <Text as="b">{fullName}</Text>
            <Box
              bgColor="gray.300"
              borderRadius="1rem"
              textAlign="center"
              maxW="3rem"
            >
              <Text fontSize="xs">User</Text>
            </Box>
            <Link fontSize="xs">Manage your profile and setting</Link>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

const Section3 = () => {
  return (
    <>
      <Box mt="2rem">
        <SimpleGrid minChildWidth="400px" column={2} spacing="2" padding="4rem">
          <Box display="flex">
            <Flex alignItems="center" p="2rem">
              <Heading fontSize="4xl">Your Rooms</Heading>
            </Flex>
          </Box>
          <Box>
            <Cardlayout />
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

const Cardlayout = () => {
  return (
    <>
      <Flex gap="2rem">
        <Card>
          <Image src="./Image/Feature1.jpg" borderRadius="8" />
          <CardHeader>
            <Heading size="md">Room 1</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="lg">Room Code:</Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
        <Card>
          <Image src="./Image/Feature1.jpg" borderRadius="8" />
          <CardHeader>
            <Heading size="md">Room 2</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="lg">Room Code:</Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </Flex>
    </>
  );
};

const Section4 = () => {
  return (
    <>
      <Box p="2rem">
        <Flex justifyContent="center">
          <Box display="flex">
            <Heading>Room Analytics</Heading>
          </Box>
        </Flex>
        <SimpleGrid column="2" minChildWidth="200px" gap="2rem" mt="2rem">
          <Box p="1rem" border="1px" borderRadius="5px" borderColor="gray.300">
            <Flex flexDir="column">
              <Text fontSize="sm">Paricipants</Text>
              <Text fontSize="2xl" as="b">
                50
              </Text>
            </Flex>
          </Box>
          <Box p="1rem" border="1px" borderRadius="5px" borderColor="gray.300">
            <Flex flexDir="column">
              <Text fontSize="sm">Question Asked</Text>
              <Text fontSize="2xl" as="b">
                100
              </Text>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

const Section5 = () => {
  return (
    <Box display="flex">
      <Flex justifyContent="center" maxW="100%">
        <BarChart />
      </Flex>
    </Box>
  );
};
