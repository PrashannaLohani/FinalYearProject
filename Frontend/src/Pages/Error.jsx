import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Error() {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Heading />
      </Box>
    </Flex>
  );
}

const Heading = () => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" color="red.500">
        Oops! Something went wrong.
      </Text>
      <Text fontSize="lg" mt="2">
        We couldn't find the page you're looking for.
      </Text>
      <Text>You can try it after logining</Text>
      <NavLink to="/Login">
        <Button colorScheme="blackAlpha" bgColor="black" mt="1rem">
          Login
        </Button>
      </NavLink>
    </Box>
  );
};
