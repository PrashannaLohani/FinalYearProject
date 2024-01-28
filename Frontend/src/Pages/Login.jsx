import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Login() {
  return (
    <>
      <Flex minH="100vh" width="full" align="center" justify="center">
        <Box w="full" maxW="30rem" p={10} textAlign="center">
          <LoginHeader />
          <LoginForm />
        </Box>
      </Flex>
    </>
  );
}

const LoginHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Login</Heading>
    </Box>
  );
};

const LoginForm = () => {
  return (
    <Box my="2rem" textAlign="left">
      <form>
        <FormControl>
          <FormLabel>Username/Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter username or Email"
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" isRequired />
        </FormControl>
        <HStack justifyContent="space-between" mt="1rem">
          <Box>
            <Checkbox>Remember Me</Checkbox>
          </Box>
          <Box>
            <Link color="gray">Forgot your password?</Link>
          </Box>
        </HStack>
        <Button w="full" colorScheme="blackAlpha" bgColor="Black" mt="1rem">
          Login
        </Button>
      </form>
      <Flex mt="1rem" justify="center" gap="5px">
        <Text>New User?</Text>
        <NavLink to="/Signup">
          <Link as="b">Signup</Link>
        </NavLink>
      </Flex>
    </Box>
  );
};
