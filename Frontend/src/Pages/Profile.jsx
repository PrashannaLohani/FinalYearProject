import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { ErrorMessage, Field, Formik } from "formik";
import { FaEnvelope, FaClock } from "react-icons/fa6";
import { Form } from "react-router-dom";

export default function Profile() {
  return (
    <>
      <Box minH="100vh">
        <Box>
          <Section1 />
          <Section2 />
          <hr />
          <Section3 />
          <Section4 />
          <Section5 />
        </Box>
      </Box>
    </>
  );
}

const Section1 = () => {
  return (
    <Box textAlign="center" mt="2rem">
      <Heading>User Profile</Heading>
      <Text mt="1rem">View and update your profile Information.</Text>
    </Box>
  );
};

const Section2 = () => {
  return (
    <>
      <Flex justifyContent="space-around" mt="2rem" alignItems="center">
        <Box textAlign="left" mb="2rem" mt="2rem">
          <Flex gap="1rem" align="center">
            <Avatar size="lg" name="John" />
            <Flex flexDir="column" gap="0.5rem">
              <Text as="b">John Doe</Text>
              <Box
                bgColor="gray.300"
                borderRadius="1rem"
                textAlign="center"
                maxW="3rem"
              >
                <Text fontSize="xs">Owner</Text>
              </Box>
              <Link fontSize="xs">Add a brief description of yourself</Link>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Flex flexDirection="column" gap="1rem">
            <Button color="black" bgColor="white" border="1px">
              Change Avatar
            </Button>
            <Button colorScheme="blackAlpha" bgColor="Black">
              Edit Profile
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

const Section3 = () => {
  return (
    <Box>
      <SimpleGrid minChildWidth="400px" column={2} spacing="2" padding="4rem">
        <Box display="flex">
          <Flex alignItems="center" p="2rem">
            <Heading fontSize="4xl">Your Rooms</Heading>
          </Flex>
        </Box>
        <Box p="1rem">
          <Infolayout />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

const Infolayout = () => {
  return (
    <>
      <Flex gap="2rem" flexDir="column">
        <Box border="1px" borderColor="gray" borderRadius="8px" p="1rem">
          <Flex alignItems="center" gap="2rem">
            <Avatar size="md" name="John" />
            <Flex flexDir="column">
              <Text fontSize="lg" as="b">
                Fullname
              </Text>
              <Text fontSize="sm">John Doe</Text>
            </Flex>
          </Flex>
        </Box>
        <Box border="1px" borderColor="gray" borderRadius="8px" p="1rem">
          <Flex alignItems="center" gap="2rem">
            <FaEnvelope style={{ fontSize: "2.5rem" }} />
            <Flex flexDir="column">
              <Text fontSize="lg" as="b">
                Email
              </Text>
              <Text fontSize="sm">abc@gmail.com</Text>
            </Flex>
          </Flex>
        </Box>
        <Box border="1px" borderColor="gray" borderRadius="8px" p="1rem">
          <Flex alignItems="center" gap="2rem">
            <FaClock style={{ fontSize: "2.5rem" }} />
            <Flex flexDir="column">
              <Text fontSize="lg" as="b">
                Account Creation Date
              </Text>
              <Text fontSize="sm">Jan 1, 2022</Text>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" mt="2rem"></Flex>
    </>
  );
};

const Section4 = () => {
  return (
    <Flex width="full" align="center" justify="center">
      <Box>
        <Flex justifyContent="center">
          <Heading>Edit Profile</Heading>
        </Flex>
        <Box mt="2rem" minW="30rem">
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.username) {
                errors.username = "Required";
              }
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
              } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = "Passwords do not match";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              // Handle form submission here
              console.log(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleSubmit, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  gap="1rem"
                  flexDir="column"
                >
                  <Field name="username">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input
                          {...field}
                          id="username"
                          type="text"
                          placeholder="Username"
                        />
                        <ErrorMessage
                          name="username"
                          render={(msg) => (
                            <div style={{ color: "red" }}>{msg}</div>
                          )}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          render={(msg) => (
                            <div style={{ color: "red" }}>{msg}</div>
                          )}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Password"
                        />
                        <ErrorMessage
                          name="password"
                          render={(msg) => (
                            <div style={{ color: "red" }}>{msg}</div>
                          )}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <FormControl>
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <Input
                          {...field}
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          render={(msg) => (
                            <div style={{ color: "red" }}>{msg}</div>
                          )}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    minW="6rem"
                    bgColor="black"
                    colorScheme="blackAlpha"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Flex>
  );
};

const Section5 = () => {
  return (
    <Box mt="3rem">
      <Flex justifyContent="center">
        <Heading>Last Room History</Heading>
      </Flex>
      <StatGroup mt="3rem">
        <Flex gap="10rem">
          <Stat minW="15rem">
            <StatLabel fontSize="xl">Number of participants</StatLabel>
            <StatNumber>345</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              2.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="xl">Commented</StatLabel>
            <StatNumber>45</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              9.05%
            </StatHelpText>
          </Stat>
        </Flex>
      </StatGroup>
    </Box>
  );
};
