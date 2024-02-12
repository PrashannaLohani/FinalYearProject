import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  PinInput,
  PinInputField,
  Text,
} from "@chakra-ui/react";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";

export default function OTP() {
  return (
    <>
      <HomepageNav />
      <hr />
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Section1 />
        <Section2 />
      </Box>
      <HomepageFooter />
    </>
  );
}

const Section1 = () => {
  return (
    <>
      <Box textAlign="center">
        <Heading>Check your Email</Heading>
        <Text>Please enter the OTP verification code sent in your email</Text>
      </Box>
    </>
  );
};

const Section2 = () => {
  return (
    <Box mt="2rem">
      <HStack>
        <PinInput>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <Flex justifyContent="center">
        <Button
          type="submit"
          bgColor="black"
          colorScheme="blackAlpha"
          mt="2rem"
        >
          Verify Code
        </Button>
      </Flex>
    </Box>
  );
};
