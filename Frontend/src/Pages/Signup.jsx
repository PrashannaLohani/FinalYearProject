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
import { useState } from "react";

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
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBox = () => {
    setIsChecked(!isChecked);
  };
  return (
    <Box my="2rem" textAlign="left">
      <form>
        <FormControl>
          <FormLabel>Fullname</FormLabel>
          <Input
            type="Text"
            name="fullname"
            placeholder="Enter your Fullname"
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email address"
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            name="cpassword"
            placeholder="Re-enter your password"
            isRequired
          />
        </FormControl>

        <Box mt="1rem">
          <HStack>
            <Checkbox
              name="checkbox"
              isChecked={isChecked}
              onChange={handleCheckBox}
            >
              <Text>
                I accecpt the{" "}
                <Link as="b" color="blue.500">
                  Privacy Policy
                </Link>{" "}
                and
                <Link as="b" color="blue.500">
                  {" "}
                  Terms of service
                </Link>
              </Text>
            </Checkbox>
          </HStack>
        </Box>
        <Button
          w="full"
          colorScheme="blackAlpha"
          bgColor="Black"
          mt="1rem"
          isDisabled={!isChecked}
          name="button"
        >
          Sign Up
        </Button>
      </form>
    </Box>
  );
};
