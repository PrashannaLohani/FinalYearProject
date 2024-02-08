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
  Link,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";
import { useEffect, useState } from "react";

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
  const [jwtToken, setJwtToken] = useState(null);
  const [LoginSuccess, setLoginSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const apiURL = "http://127.0.0.1:8000/login/";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get-csrf-token/login/"
        );
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);
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
          console.log("Form Values:", values);
          try {
            // Make a POST request to your Django backend
            const response = await axios.post(apiURL, values, {
              withCredentials: true, // Ensure cookies are sent with the request
            });

            if (response.data.message === "Login success") {
              // Set JWT token
              setJwtToken(response.data.token);
              // Handle successful login (redirect, show success message, etc.)
            } else {
              // Handle login failure
              setErrorMessage("Enter correct Email or password");
            }
          } catch (error) {
            console.error("Error:", error);
            // Handle other errors (network error, server error, etc.)
            setErrorMessage("Something went wrong. Please try again later.");
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
              <Input
                type="password"
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                isRequired
              />
              {errors.password && touched.password && (
                <Text color="red">{errors.password}</Text>
              )}
            </FormControl>

            <HStack justifyContent="space-between" mt="1rem">
              <Box></Box>
              <Box>
                <Link color="gray">Forgot your password?</Link>
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
      <Flex mt="1rem" justify="center" gap="5px">
        <Text>New User?</Text>
        <NavLink to="/Signup">
          <Link as="b">Signup</Link>
        </NavLink>
      </Flex>
    </Box>
  );
};
