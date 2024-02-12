import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import HomepageNav from "../../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../../Layout/Homepage/HomepageFooter";
import { NavLink } from "react-router-dom";
import OTP from "./OTP";

export default function EmailVerification() {
  return (
    <>
      <HomepageNav />
      <hr />
      <Box
        minH="100vh"
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Flex flexDir="column">
          <Box>
            <Section1 />
            <Section2 />
          </Box>
        </Flex>
      </Box>
      <HomepageFooter />
    </>
  );
}

const Section1 = () => {
  return (
    <Box>
      <Heading>Verify the email</Heading>
      <Box>
        <Text mt="1rem">
          A OTP code will be sent to the email address you provide.
        </Text>
      </Box>
    </Box>
  );
};

const Section2 = () => {
  const initialValues = {
    email: "",
  };

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Flex flexDir="column" gap="1rem">
            <Field name="email" validate={validateEmail}>
              {({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  type="email"
                  width="25rem"
                  minW="10rem"
                  maxW="100%"
                  placeholder="Email"
                  mt="3rem"
                  isRequired
                />
              )}
            </Field>
            <ErrorMessage name="email" component="div" color="red" />
            <NavLink to="/OTP" element={<OTP />}>
              <Button
                type="submit"
                bgColor="black"
                colorScheme="blackAlpha"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </Button>
            </NavLink>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
