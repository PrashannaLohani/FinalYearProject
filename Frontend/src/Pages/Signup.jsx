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
  Text,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { useEffect, useState } from "react";

const Signup = () => {
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
                handleBlur,
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
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
                  >
                    Sign Up
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Flex>
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
