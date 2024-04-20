import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa6";

export default function ParticipantRoom() {
  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <RoomCode />
      <Box
        minH="100vh"
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <RoomHeading />
        <CommentSection />
      </Box>
    </Box>
  );
}

const RoomCode = () => {
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Room Code: </Heading>
      </Flex>
    </Box>
  );
};

const RoomHeading = () => {
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Heading size="lg">Comments and Questions</Heading>
        {/* <Flex flexDir="column">
          <Text>Number of people Joined: 100</Text>
          <Text>Number of comments: 20</Text>
        </Flex> */}
      </Flex>
    </>
  );
};

const CommentSection = () => {
  return (
    <>
      <Box mt="2rem" minH="100vh" p="2rem">
        <SimpleGrid
          columns={3}
          spacing="1rem"
          minChildWidth="200px"
          autoRows="auto"
        >
          <Card variant="outline" maxW="30rem" bgColor="#FFE6E6">
            <CardHeader>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Heading size="lg">User918</Heading>
                <Flex alignItems="center" gap="5px">
                  <Text as="b">Upvote:</Text>
                  <Button bgColor="black">
                    <FaHeart style={{ color: "white" }} />
                  </Button>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="md">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum
                quas aliquam, officiis alias neque excepturi. Eius atque amet
                est, nihil reiciendis sapiente blanditiis rerum a hic?
                Distinctio optio ipsa nostrum!
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </>
  );
};
