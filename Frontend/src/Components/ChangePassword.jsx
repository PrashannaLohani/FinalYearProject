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
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword({ isOpen, onClose }) {
  const [error, setError] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibilityOld = () => {
    setShowOldPassword(!showOldPassword);
  };
  const togglePasswordVisibilityNew = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordVisibilityConfirm = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toast = useToast();
  const SuccessToast = () => {
    toast({
      title: "Password Updated.",
      description: "We've updated your password.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

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
                const token = localStorage.getItem("accessToken");
                const headers = {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                };

                const response = await axios.post(
                  "http://127.0.0.1:8000/change-password/",
                  {
                    old_password: values.oldPassword,
                    new_password: values.newPassword,
                    confirm_password: values.confirmPassword,
                  },
                  { headers }
                );

                console.log(response.data);
                onClose();
                SuccessToast();
              } catch (error) {
                console.error("Error:", error);
                if (error.response) {
                  // Server responded with an error status code
                  setError(error.response.data.error);
                } else if (error.request) {
                  // The request was made but no response was received
                  setError("No response received from the server.");
                } else {
                  // Something happened in setting up the request that triggered an error
                  setError("An unexpected error occurred.");
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <DrawerBody>
                  <Flex flexDir="column" gap="1rem">
                    <InputGroup>
                      <Field
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        placeholder="Old password"
                        as={Input}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={togglePasswordVisibilityOld}
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    <ErrorMessage
                      name="oldPassword"
                      component="div"
                      style={{ color: "red" }}
                    />
                    <InputGroup>
                      <Field
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                        as={Input}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={togglePasswordVisibilityNew}
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
                    <InputGroup>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        as={Input}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={togglePasswordVisibilityConfirm}
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
                    color="white"
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
