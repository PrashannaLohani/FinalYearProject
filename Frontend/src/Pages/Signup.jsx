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
} from "@chakra-ui/react";

export default function Signup() {
  return (
    <>
      <Flex minH="100vh" width="full" align="center" justify="center">
        <Box w="full" maxW="30rem" p={10} textAlign="center">
          <SignupHeader />
          <SignupForm />
        </Box>
      </Flex>
    </>
  );
}

const SignupHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Signup</Heading>
    </Box>
  );
};

const SignupForm = () => {
  return (
    <Box my="2rem" textAlign="left">
      <form>
        <FormControl>
          <FormLabel>Fullname</FormLabel>
          <Input type="Text" placeholder="Enter your Fullname" isRequired />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email address"
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" isRequired />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Re-enter your password"
            isRequired
          />
        </FormControl>

        <Box mt="1rem">
          <HStack>
            <Checkbox>
              <Link>Terms&Policy</Link>
            </Checkbox>
            <Checkbox>
              <Link>Privacy Policy</Link>
            </Checkbox>
          </HStack>
        </Box>
        <Button
          w="full"
          colorScheme="blackAlpha"
          bgColor="Black"
          mt="1rem"
          //   isDisabled
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
};
