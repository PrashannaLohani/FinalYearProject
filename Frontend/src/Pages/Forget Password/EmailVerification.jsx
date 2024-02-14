import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import axios from "axios";
import { useState } from "react";

export default function EmailVerification() {
  return (
    <>
      <HomepageNav />
      <hr />
      <Box
        minH="100vh"
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Flex flexDir="column">
          <Box>
            <Section1 />
            <Section2 />
          </Box>
        </Flex>
      </Box>
      <HomepageFooter />
    </>
  );
}

const Section1 = () => {
  return (
    <Box>
      <Heading>Verify the email</Heading>
      <Box>
        <Text mt="1rem">
          A OTP code will be sent to the email address you provide.
        </Text>
      </Box>
    </Box>
  );
};

const Section2 = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const initialValues = {
    email: "",
  };

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Make an HTTP POST request to your backend
      const response = await axios.post(
        "http://localhost:8000/verify-email/",
        values
      );
      console.log(response.data); // Log the response from the backend
      setSubmitted(true); // Set submitted state to true
      setErrorOccurred(false);
    } catch (error) {
      setErrorOccurred(true);
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      {!submitted && (
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex flexDir="column" gap="1rem">
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      type="email"
                      width="25rem"
                      minW="10rem"
                      maxW="100%"
                      placeholder="Email"
                      mt="3rem"
                      isRequired
                    />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" color="red" />

                <Button
                  type="submit"
                  bgColor="black"
                  colorScheme="blackAlpha"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      )}
      {errorOccurred && (
        <Alert status="error" mt="1rem">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>Please enter correct Email.</AlertDescription>
        </Alert>
      )}
    </>
  );
};
