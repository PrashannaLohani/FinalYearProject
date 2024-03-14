import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import BarChart from "../Components/BarGraph";
import CustomAvatar from "../Components/Avatar";
import { useUserInfo } from "../Components/UserInfo";
import { FaBox } from "react-icons/fa6";

export default function Info() {
  const userInfo = useUserInfo();
  const { full_name } = userInfo || {};
  return (
    <>
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "5rem" }}>
        <Box
          minH="100vh"
          borderRadius="2rem"
          boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
          p="2rem"
          minW="20rem"
        >
          <Welcome full_name={full_name} />
          <Dashboard />
        </Box>
      </Box>
    </>
  );
}

const Welcome = ({ full_name }) => {
  return (
    <Box>
      <Heading size="lg">Welcome {full_name} !</Heading>
      <Box bgColor="Yellow" height="15rem" mt="2rem" rounded="2rem"></Box>
    </Box>
  );
};

const Dashboard = () => {
  return (
    <Box
      bg="red"
      minH="100vh"
      minW="10rem"
      mt="2rem"
      p={{ base: "1rem", md: "2rem" }}
    >
      <SimpleGrid
        minChildWidth="200px"
        // templateColumns="repeat(3, 1fr)"
        gap={4}
      >
        <Box maxH="10rem" minH="15rem" bgColor="blue"></Box>
        <Box maxH="10rem" minH="15rem" bgColor="blue"></Box>
        <Box maxH="10rem" minH="15rem" bgColor="blue"></Box>
        <Box
          maxH="10rem"
          minH="15rem"
          bgColor="blue"
          // gridColumn="1 / span 2"
        ></Box>
        <Box maxH="10rem" minH="15rem" bgColor="blue"></Box>
      </SimpleGrid>
    </Box>
  );
};
