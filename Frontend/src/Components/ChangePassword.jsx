import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import axios from "axios";

export default function ChangePassword({ isOpen, onClose }) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Change Password</DrawerHeader>

          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.oldPassword) {
                errors.oldPassword = "Required";
              }
              if (!values.newPassword) {
                errors.newPassword = "Password is required";
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
              } else if (values.confirmPassword !== values.newPassword) {
                errors.confirmPassword = "Passwords do not match";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                // Send POST request to the backend
                const response = await axios.post(
                  "http://127.0.0.1:8000/change-password/",
                  values
                );
                console.log(response.data); // Handle response data as needed
                onClose(); // Close the drawer after successful submission
              } catch (error) {
                console.error("Error:", error);
                // Handle error as needed
              } finally {
                setSubmitting(false); // Set submitting state back to false
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <DrawerBody>
                  <Flex flexDir="column" gap="1rem">
                    <Field
                      type="Password"
                      name="oldPassword"
                      placeholder="Old Password"
                      as={Input}
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      style={{ color: "red" }}
                    />

                    <Field
                      type="Password"
                      name="newPassword"
                      placeholder="New Password"
                      as={Input}
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      style={{ color: "red" }}
                    />

                    <Field
                      type="Password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      as={Input}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Flex>
                </DrawerBody>

                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blackAlpha"
                    bgColor="black"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Confirm
                  </Button>
                </DrawerFooter>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </Drawer>
    </>
  );
}
