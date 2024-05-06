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
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";
import Privacy from "./Privacy";
import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Terms from "./Terms&service";

const SignupHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Signup</Heading>
    </Box>
  );
};
const Signup = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const apiURL = "http://127.0.0.1:8000/Signup/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    isOpen: PrivacyIsOpen,
    onOpen: PrivacyOnOpen,
    onClose: PrivacyOnClose,
  } = useDisclosure();
  const {
    isOpen: TermIsOpen,
    onOpen: TermOnOpen,
    onClose: TermOnClose,
  } = useDisclosure();

  const showPass = () => {
    setShowPassword(!showPassword);
  };
  const showConfirmPass = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toast = useToast();
  const SuccessToast = () => {
    toast({
      title: "Account created.",
      description: "You can access your login with your account now.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

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
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                // console.log("Form Values:", values);
                try {
                  // Make a POST request to your Django backend
                  const response = await axios.post(apiURL, values, {
                    headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": csrfToken,
                    },
                  });
                  SuccessToast();
                  resetForm();
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
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        value={values.password}
                        isRequired
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={showPass}
                          bg="white"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Confirm Password</FormLabel>
                      {errors.cpassword && touched.cpassword && (
                        <Text color="red.500">{errors.cpassword}</Text>
                      )}
                    </Flex>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="cpassword"
                        placeholder="Re-enter your password"
                        onChange={handleChange}
                        value={values.cpassword}
                        isRequired
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={showConfirmPass}
                          bg="white"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
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
                        <a
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={PrivacyOnOpen}
                        >
                          Privacy Policy{" "}
                        </a>
                        and{" "}
                        <a
                          style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={TermOnOpen}
                        >
                          Terms of service
                        </a>
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
            <Privacy
              isOpen={PrivacyIsOpen}
              onClose={PrivacyOnClose}
              onOpen={PrivacyOnOpen}
            />
            <Terms
              isOpen={TermIsOpen}
              onClose={TermOnClose}
              onOpen={TermOnOpen}
            />
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Signup;
