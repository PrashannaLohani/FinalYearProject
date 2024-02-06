import axios from "axios";
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
import { NavLink } from "react-router-dom";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Login from "./Login";

const Signup = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [csrfToken, setCsrfToken] = useState(null);
  const apiURL = "http://127.0.0.1:8000/Signup/";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get-csrf-token/"
        );
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  return (
    <>
      <Flex minH="100vh" width="full" align="center" justify="center">
        <Box w="full" maxW="30rem" p={10} textAlign="center">
          <SignupHeader />
          <Box mt="3rem">
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                password: "",
                cpassword: "",
                checkbox: false,
              }}
              validate={(values) => {
                const errors = {};
                // ... (validation logic)
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                console.log("Form Values:", values);
                try {
                  // Make a POST request to your Django backend
                  const response = await axios.post(apiURL, values, {
                    headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": csrfToken,
                    },
                  });
                  onOpen();
                  // Handle the response or any additional logic here
                  console.log("User created successfully:", response.data);
                } catch (error) {
                  console.error("Error creating user:", error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl>
                    <Flex>
                      <FormLabel>Fullname</FormLabel>
                      {errors.fullname && touched.fullname && (
                        <Text color="red.500">{errors.fullname}</Text>
                      )}
                    </Flex>
                    <Input
                      type="text"
                      name="fullname"
                      placeholder="Enter your Fullname"
                      onChange={handleChange}
                      value={values.fullname}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Email</FormLabel>
                      {errors.email && touched.email && (
                        <Text color="red.500">{errors.email}</Text>
                      )}
                    </Flex>

                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Password</FormLabel>
                      {errors.password && touched.password && (
                        <Text color="red.500">{errors.password}</Text>
                      )}
                    </Flex>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Confirm Password</FormLabel>
                      {errors.cpassword && touched.cpassword && (
                        <Text color="red.500">{errors.cpassword}</Text>
                      )}
                    </Flex>
                    <Input
                      type="password"
                      name="cpassword"
                      placeholder="Re-enter your password"
                      onChange={handleChange}
                      value={values.cpassword}
                    />
                  </FormControl>

                  <Box mt="1rem">
                    <HStack>
                      <Checkbox
                        name="checkbox"
                        isChecked={values.checkbox}
                        onChange={handleChange}
                        isDisabled={isSubmitting}
                      >
                        <Text>
                          I accept the{" "}
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
                    type="submit"
                    isDisabled={!values?.checkbox || isSubmitting}
                    onClick={onOpen}
                    isLoading={isSubmitting}
                  >
                    Sign Up
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Flex>
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
          <ModalHeader>User Created</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Now you can login and use the services.</Text>
          </ModalBody>

          <ModalFooter gap="1rem">
            <NavLink to="/Login" element={<Login />}>
              <Button bgColor="black" colorScheme="blackAlpha">
                Login
              </Button>
            </NavLink>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SignupHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Signup</Heading>
    </Box>
  );
};

export default Signup;
