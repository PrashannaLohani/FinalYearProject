import axios from "axios";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
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
import { useState } from "react";
import Info from "./Info";
import EmailVerification from "./Forget Password/EmailVerification";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formSubmitted, setFormSubmitted] = useState(false);
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
              // Store tokens in local storage
              localStorage.setItem("accessToken", response.data.access_token);
              localStorage.setItem("refreshToken", response.data.refresh_token);
              // Open the modal
              onOpen();
              setErrorOccurred(false);
            }
          } catch (error) {
            setFormSubmitted(true);
            setErrorOccurred(true);
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
      {errorOccurred && (
        <Alert status="error" mt="1rem">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Please enter correct Email or Password.
          </AlertDescription>
        </Alert>
      )}
      <Flex mt="1rem" justify="center" gap="5px">
        <Text>New User?</Text>
        <NavLink to="/Signup">
          <Link as="b">Signup</Link>
        </NavLink>
      </Flex>
      <Message_popup isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

const Message_popup = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You have successfully Logged in.</Text>
          </ModalBody>

          <ModalFooter gap="1rem">
            <NavLink to="/Info" element={<Info />}>
              <Button bgColor="black" colorScheme="blackAlpha">
                Proceed
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
