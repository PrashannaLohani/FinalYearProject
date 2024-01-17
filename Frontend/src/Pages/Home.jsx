import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
export default function Home() {
  return (
    <>
      <Flex margin="1rem" flexWrap="wrap">
        <Box>
          <Text fontSize="2xl" as="b">
            React & Rise
          </Text>
        </Box>
        <Spacer />
        <Flex gap="1rem" flexWrap="wrap">
          <Button
            colorScheme="blackAlpha"
            borderRadius="8"
            backgroundColor="black"
          >
            Login
          </Button>
          <Button variant="ghost" borderRadius="8">
            Signup
          </Button>
        </Flex>
      </Flex>
      <hr />
      <Flex justify="center" flexDir="column" alignItems="center">
        <Text as="b" fontSize="4xl" mt="2rem" textAlign="center">
          Welcome to React & Rise
        </Text>
        <Text textAlign="center" mt="1rem">
          The platform where you can interact without hesitation.
        </Text>
        <Button colorScheme="blackAlpha" backgroundColor="black" mt="1rem">
          Get started
        </Button>
      </Flex>
      <Box backgroundColor="teal">
        <Flex alignItems="center">
          <Text fontSize="4xl" as="b">
            Features
          </Text>
        </Flex>
      </Box>
      <footer>
        <Flex gap="1.5rem" justifyContent="center" flexWrap="wrap" mt="2rem">
          <Text>Contact: plohani2003@gmail.com</Text>
          <Text>Privacy policy</Text>
          <Text>Terms of Service</Text>
          <Text>2024 React&Rise. All right reserved.</Text>
        </Flex>
      </footer>
    </>
  );
}
