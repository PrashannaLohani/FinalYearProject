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
import { NavLink } from "react-router-dom";
import { Formik } from "formik";

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
        onSubmit={(values, { setSubmitting }) => {
          // Your form submission logic goes here
          console.log("Form Values:", values);

          // Simulate API call or navigate to the next page
          // For a real API call, you would use axios or fetch
          setTimeout(() => {
            // Handle the response or any additional logic here
            console.log("User logged in successfully");
            setSubmitting(false);
          }, 1000);
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
