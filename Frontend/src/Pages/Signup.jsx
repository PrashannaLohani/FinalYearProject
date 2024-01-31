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
import { Formik } from "formik";

export default function Signup() {
  return (
    <>
      <Flex minH="100vh" width="full" align="center" justify="center">
        <Box w="full" maxW="30rem" p={10} textAlign="center">
          <SignupHeader />
          <Box mt="3rem">
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                password: "",
                cpassword: "",
                checkbox: false,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.fullname) {
                  errors.fullname = "*";
                }
                if (!values.email) {
                  errors.email = "*";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                if (!values.password) {
                  errors.password = "*";
                }
                if (!values.cpassword) {
                  errors.cpassword = "*";
                } else if (values.cpassword !== values.password) {
                  errors.cpassword = "Passwords must match";
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                // Your form submission logic here
                console.log(values);
                setSubmitting(false);
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
                  <FormControl>
                    <Flex>
                      <FormLabel>Fullname</FormLabel>
                      {errors.fullname && touched.fullname && (
                        <Text color="red.500">{errors.fullname}</Text>
                      )}
                    </Flex>
                    <Input
                      type="text"
                      name="fullname"
                      placeholder="Enter your Fullname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullname}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Email</FormLabel>
                      {errors.email && touched.email && (
                        <Text color="red.500">{errors.email}</Text>
                      )}
                    </Flex>

                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Password</FormLabel>
                      {errors.password && touched.password && (
                        <Text color="red.500">{errors.password}</Text>
                      )}
                    </Flex>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <Flex>
                      <FormLabel>Confirm Password</FormLabel>
                      {errors.cpassword && touched.cpassword && (
                        <Text color="red.500">{errors.cpassword}</Text>
                      )}
                    </Flex>
                    <Input
                      type="password"
                      name="cpassword"
                      placeholder="Re-enter your password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cpassword}
                    />
                  </FormControl>

                  <Box mt="1rem">
                    <HStack>
                      <Checkbox
                        name="checkbox"
                        isChecked={values.checkbox}
                        onChange={handleChange}
                        isDisabled={isSubmitting}
                      >
                        <Text>
                          I accept the{" "}
                          <Link as="b" color="blue.500">
                            Privacy Policy
                          </Link>{" "}
                          and
                          <Link as="b" color="blue.500">
                            {" "}
                            Terms of service
                          </Link>
                        </Text>
                      </Checkbox>
                    </HStack>
                  </Box>
                  <Button
                    w="full"
                    colorScheme="blackAlpha"
                    bgColor="Black"
                    mt="1rem"
                    type="submit"
                    isDisabled={!values?.checkbox || isSubmitting}
                  >
                    Sign Up
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

const SignupHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Signup</Heading>
    </Box>
  );
};
