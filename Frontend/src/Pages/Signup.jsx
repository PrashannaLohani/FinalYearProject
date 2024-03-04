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
import Privacy from "./Privacy";
import Terms from "./terms&service";

const SignupHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Signup</Heading>
    </Box>
  );
};
const Signup = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [csrfToken, setCsrfToken] = useState(null);
  const apiURL = "http://127.0.0.1:8000/Signup/";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get-csrf-token/signup/"
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
        <Box w="full" maxW="35rem" p={10} textAlign="center">
          <SignupHeader />
          <Box mt="3rem">
            <Formik
              initialValues={{
                full_name: "",
                email: "",
                password: "",
                cpassword: "",
                checkbox: false,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.full_name) {
                  errors.full_name = "Fullname is required";
                }
                if (!values.email) {
                  errors.email = "Email is required";
                }
                if (!values.password) {
                  errors.password = "Password is required";
                } else if (values.password.length < 8) {
                  errors.password = "Password must be at least 8 characters";
                } else if (/^\d+$/.test(values.password)) {
                  errors.password = "Password can't be entirely numeric";
                } else if (
                  !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(values.password)
                ) {
                  errors.password =
                    "Password must contain at least one special character";
                } else if (!/[a-z]/.test(values.password)) {
                  errors.password =
                    "Password must contain at least one lowercase letter";
                } else if (!/[A-Z]/.test(values.password)) {
                  errors.password =
                    "Password must contain at least one uppercase letter";
                }

                if (!values.cpassword) {
                  errors.cpassword = "Confirm password is required";
                } else if (values.cpassword !== values.password) {
                  errors.cpassword = "Passwords do not match";
                }
                if (!values.checkbox) {
                  errors.checkbox =
                    "You must accept the terms and privacy policy";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                // console.log("Form Values:", values);
                try {
                  // Make a POST request to your Django backend
                  const response = await axios.post(apiURL, values, {
                    headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": csrfToken,
                    },
                  });
                  onOpen();
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
                      {errors.full_name && touched.full_name && (
                        <Text color="red.500">{errors.full_name}</Text>
                      )}
                    </Flex>
                    <Input
                      type="text"
                      name="full_name"
                      placeholder="Enter your Fullname"
                      onChange={handleChange}
                      value={values.full_name}
                      isRequired
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
                      isRequired
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
                      isRequired
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
                      isRequired
                    />
                  </FormControl>

                  <Box mt="1rem">
                    <HStack>
                      <Checkbox
                        name="checkbox"
                        isChecked={values.checkbox}
                        onChange={handleChange}
                        isDisabled={isSubmitting}
                      ></Checkbox>
                      <Text>
                        I accept the{" "}
                        <NavLink
                          to="/Privacy-Policy"
                          element={<Privacy />}
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          Privacy Policy
                        </NavLink>{" "}
                        and
                        <NavLink
                          to="/Terms&Services"
                          element={<Terms />}
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          {" "}
                          Terms of service
                        </NavLink>
                      </Text>
                    </HStack>
                  </Box>
                  <Button
                    w="full"
                    colorScheme="blackAlpha"
                    bgColor="Black"
                    mt="1rem"
                    type="submit"
                    isDisabled={!values?.checkbox || isSubmitting}
                    onSubmit={onOpen}
                    isLoading={isSubmitting}
                  >
                    Sign Up
                  </Button>
                </form>
              )}
            </Formik>
            <Flex mt="1rem" justify="center" gap="5px">
              <Text>Already have an account?</Text>
              <NavLink to="/Login">
                <Link as="b">Login</Link>
              </NavLink>
            </Flex>
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

export default Signup;
