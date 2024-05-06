// ContactForm.jsx
import { Formik, Form, Field } from "formik";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Box,
  Heading,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const ContactForm = () => {
  const initialValues = {
    name: "",
    email: "",
    message: "",
  };
  const toast = useToast();
  const SuccessToast = () => {
    toast({
      title: "Email sent.",
      description: "Thank you for the feedback!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/contact-us/",
        values
      );
      actions.resetForm();
      SuccessToast();

      actions.setSubmitting(false);
    } catch (error) {
      console.error("Error:", error); // Handle error
      actions.setSubmitting(false);
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.message) {
      errors.message = "Message is required";
    }
    return errors;
  };

  return (
    <Box mt="3rem">
      <Box>
        <Flex justifyContent="center">
          <Heading size="2xl">Contact Us</Heading>
        </Flex>
      </Box>
      <Flex justifyContent="center" alignItems="center" mt="3rem">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={validateForm}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex direction="column" alignItems="center">
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                      mt={4}
                    >
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Enter your name"
                        minW="30rem"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mt={4}
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        {...field}
                        id="email"
                        placeholder="Enter your email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="message">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.message && form.touched.message}
                      mt={4}
                    >
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <Textarea
                        {...field}
                        id="message"
                        placeholder="Enter your message"
                      />
                      <FormErrorMessage>{form.errors.message}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  type="submit"
                  mt={4}
                  colorScheme="blackAlpha"
                  bgColor="black"
                  isLoading={isSubmitting}
                  loadingText="Sending"
                  color="white"
                >
                  Send
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
};

export default ContactForm;
