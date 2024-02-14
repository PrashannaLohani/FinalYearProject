import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import axios from "axios";
import { NavLink } from "react-router-dom";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    } catch (error) {
      onOpen();
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      {submitted ? (
        // If submitted is true, render the component you want to navigate to
        <NavLink to="/OTP" element={<OTP />} />
      ) : (
        // Otherwise, render the form
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
      <Message_popup isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const Message_popup = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Email not Found!</Text>
          </ModalBody>

          <ModalFooter gap="1rem">
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
