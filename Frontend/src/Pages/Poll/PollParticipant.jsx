import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FaChartBar } from "react-icons/fa6";
export default function PollParticipant() {
  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <PollCode />
      <Box
        minH={{ base: "100vh", lg: "none" }}
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <HeadLine />
        <Main />
      </Box>
    </Box>
  );
}

const PollCode = () => {
  const handleEndSession = () => {
    window.location.href = "/info";
  };
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Poll Code: </Heading>
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleEndSession}
        >
          Exit
        </Button>
      </Flex>
    </Box>
  );
};

const HeadLine = () => {
  return (
    <>
      <Heading size="lg">
        <Flex alignItems="center" gap="1rem">
          <FaChartBar /> <Text>Ranking</Text>
        </Flex>
      </Heading>
    </>
  );
};

const Main = () => {
  return (
    <>
      <Heading mt="2rem" size={{ base: "lg", lg: "xl" }}>
        Write Your question?
      </Heading>
      <Divider mt="1rem" />
      <Box mt="2rem">
        <SimpleGrid columns={2} spacing={10} minChildWidth="200px">
          <Button bgColor="rgba(255, 99, 132, 1)" minH="4rem">
            Option 1
          </Button>
          <Button bgColor="rgba(54, 162, 235, 1)" minH="4rem">
            Option 2
          </Button>
        </SimpleGrid>
      </Box>
    </>
  );
};
