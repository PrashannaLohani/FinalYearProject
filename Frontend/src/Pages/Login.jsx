import axios from "axios";
import {
  Box,
  Button,
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
import { useState } from "react";
import EmailVerification from "./Forget Password/EmailVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const showPass = () => {
    setShowPassword(!showPassword);
  };
  const handleLoginClick = (targetPage) => {
    window.location.href = targetPage;
  };

  const handleLogin = () => {
    const successPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
    toast.promise(successPromise, {
      success: { title: "Login Successful.", description: "Welcome." },
      loading: { title: "Logging in...", description: "Please wait" },
      error: { title: "Login failed", description: "Something went wrong" },
    });
  };

  const apiURL = "http://127.0.0.1:8000/login/";
  return (
    <Box my="2rem" textAlign="left">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};

          // Validate email
          if (!values.email) {
            errors.email = "Email is required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          // Validate password
          if (!values.password) {
            errors.password = "Password is required";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          // console.log("Form Values:", values);
          try {
            // Make a POST request to your Django backend
            const response = await axios.post(apiURL, values, {
              withCredentials: true, // Ensure cookies are sent with the request
            });

            if (response.status === 200 && response.data.access_token) {
              handleLogin();
              // Store tokens in local storage
              localStorage.setItem("accessToken", response.data.access_token);
              localStorage.setItem("refreshToken", response.data.refresh_token);
              // Open the modal

              setTimeout(() => {
                setErrorOccurred(false);
                handleLoginClick("/info");
              }, 3000);
            }
          } catch (error) {
            setFormSubmitted(true);
            toast({
              title: "Login failed",
              description: "Please enter correct Email or Password.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } finally {
            setFormSubmitted(false);
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
          <form onSubmit={handleSubmit} method="post" action="/login/">
            <FormControl isInvalid={errors.email && touched.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                isRequired
              />
              {errors.email && touched.email && (
                <Text color="red">{errors.email}</Text>
              )}
            </FormControl>

            <FormControl mt={4} isInvalid={errors.password && touched.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  isRequired
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={showPass} bg="white">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && touched.password && (
                <Text color="red">{errors.password}</Text>
              )}
            </FormControl>

            {formSubmitted && (
              <Text color="red" mt={2}>
                Your email or password is incorrect.
              </Text>
            )}

            <HStack justifyContent="space-between" mt="1rem">
              <Box></Box>
              <Box>
                <NavLink
                  color="gray"
                  to="/EmailVerificaiton"
                  element={<EmailVerification />}
                >
                  <span
                    style={{
                      textDecoration: "none",
                      borderBottom: "1px solid transparent",
                    }} // set default border to transparent
                    onMouseEnter={(e) => {
                      e.target.style.borderBottom = "1px solid gray";
                    }} // change border on hover
                    onMouseLeave={(e) => {
                      e.target.style.borderBottom = "1px solid transparent";
                    }} // revert border on mouse leave
                  >
                    Forgot your password?
                  </span>
                </NavLink>
              </Box>
            </HStack>

            <Button
              w="full"
              colorScheme="blackAlpha"
              bgColor="black"
              mt="1rem"
              type="submit"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </form>
        )}
      </Formik>
      {errorOccurred &&
        toast({
          title: "Login failed",
          description: "Please enter correct Email or Password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })}
      <Flex mt="1rem" justify="center" gap="5px">
        <Text>New User?</Text>
        <NavLink to="/Signup">
          <Link as="b">Signup</Link>
        </NavLink>
      </Flex>
    </Box>
  );
};
