import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import { useState } from "react";
import axios from "axios";

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/verify-email/",
        values
      );

      const { uidb64, token } = response.data;

      const updatePasswordResponse = await axios.post(
        `http://localhost:8000/update-password/accounts/reset${uidb64}/${token}/`,
        values
      );

      console.log(updatePasswordResponse.data); // Log the response from the backend

      setSubmitted(true); // Set submitted state to true
      setErrorOccurred(false);
    } catch (error) {
      setErrorOccurred(true);
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <Box w="30rem" mt="2rem">
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
                <Field type="password" name="newPassword" as={Input} />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  style={{ color: "red" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm password</FormLabel>
                <Field type="password" name="confirmPassword" as={Input} />
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
    </Box>
  );
};
