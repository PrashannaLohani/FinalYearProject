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
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UpdatePassword() {
  return (
    <>
      <HomepageNav />
      <hr />
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Section1 />
        <Section2 />
      </Box>
      <HomepageFooter />
    </>
  );
}

const Section1 = () => {
  return (
    <Box textAlign="center">
      <Heading>Change Password</Heading>
    </Box>
  );
};

const Section2 = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const { uidb64, token } = useParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibilityNew = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordVisibilityConfirm = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatePasswordResponse = await axios.post(
        `http://localhost:8000/update-password/${uidb64}/${token}/`,
        {
          password: values.newPassword,
          confirm_password: values.confirmPassword,
        }
      );
      setSubmitted(true);
      setErrorOccurred(false);
    } catch (error) {
      setErrorOccurred(true);
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <Box w="30rem" mt="2rem">
      {!submitted && (
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validate={(values) => {
            const errors = {};
            // Add your custom validation logic here
            if (!values.newPassword) {
              errors.newPassword = "Required";
            } else if (values.newPassword.length < 8) {
              errors.newPassword = "Password must be at least 8 characters";
            } else if (/^\d+$/.test(values.newPassword)) {
              errors.newPassword = "Password can't be entirely numeric";
            } else if (
              !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(values.newPassword)
            ) {
              errors.newPassword =
                "Password must contain at least one special character";
            } else if (!/[a-z]/.test(values.newPassword)) {
              errors.newPassword =
                "Password must contain at least one lowercase letter";
            } else if (!/[A-Z]/.test(values.newPassword)) {
              errors.newPassword =
                "Password must contain at least one uppercase letter";
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = "Required";
            } else if (values.newPassword !== values.confirmPassword) {
              errors.confirmPassword = "Passwords do not match";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex flexDir="column">
                <FormControl>
                  <FormLabel>New password</FormLabel>
                  <InputGroup>
                    <Field
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      as={Input}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisibilityNew}
                        bg="white"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Confirm password</FormLabel>
                  <InputGroup>
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      as={Input}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisibilityConfirm}
                        bg="white"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  bgColor="black"
                  colorScheme="blackAlpha"
                  mt="1rem"
                  isLoading={isSubmitting}
                >
                  Confirm
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      )}
      {submitted && (
        <Alert status="success" mt="1rem">
          <AlertIcon />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your password has been updated.</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};
