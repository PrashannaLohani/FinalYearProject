import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";

export default function Profile() {
  return (
    <>
      <Box minH="100vh">
        <Box>
          <Section1 />
          <Section2 />
          <hr />
        </Box>
      </Box>
    </>
  );
}

const Section1 = () => {
  return (
    <Box textAlign="center" mt="2rem">
      <Heading>User Profile</Heading>
      <Text mt="1rem">View and update your profile Information.</Text>
    </Box>
  );
};

const Section2 = () => {
  return (
    <>
      <Flex justifyContent="space-around" mt="2rem" alignItems="center">
        <Box textAlign="left" mb="2rem" mt="2rem">
          <Flex gap="1rem" align="center">
            <Avatar size="lg" name="Profile" />
            <Flex flexDir="column" gap="0.5rem">
              <Text as="b">John Doe</Text>
              <Box
                bgColor="gray.300"
                borderRadius="1rem"
                textAlign="center"
                maxW="3rem"
              >
                <Text fontSize="xs">Owner</Text>
              </Box>
              <Link fontSize="xs">Add a brief description of yourself</Link>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex flexDirection="column" gap="1rem">
            <Button color="black" bgColor="white" border="1px">
              Change Avatar
            </Button>
            <Button colorScheme="blackAlpha" bgColor="Black">
              Edit Profile
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
