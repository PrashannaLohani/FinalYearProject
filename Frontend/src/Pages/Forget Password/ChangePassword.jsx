import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";

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
  const handleSubmit = (values, actions) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);
    actions.setSubmitting(false); // You can remove this line if you're redirecting or doing something else after submission
  };

  return (
    <Box w="30rem" mt="2rem">
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validate={(values) => {
          const errors = {};
          // Add your custom validation logic here
          if (!values.newPassword) {
            errors.newPassword = "New password is required";
          }
          if (!values.confirmPassword) {
            errors.confirmPassword = "Confirm password is required";
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
