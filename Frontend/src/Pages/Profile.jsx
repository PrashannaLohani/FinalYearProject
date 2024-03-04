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
import axios from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { FaEnvelope, FaClock } from "react-icons/fa6";
import { Form } from "react-router-dom";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get("http://127.0.0.1:8000/info/", config);

      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  return (
    <>
      <Box minH="100vh">
        <Box>
          <Section1 />
          <Section2 fullName={userInfo ? userInfo.full_name : ""} />
          <hr />
          <Section3 userInfo={userInfo} />
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

const Section2 = ({ fullName }) => {
  return (
    <>
      <Flex justifyContent="space-around" mt="2rem" alignItems="center">
        <Box textAlign="left" mb="2rem" mt="2rem">
          <Flex gap="1rem" align="center">
            <Avatar size="lg" name="John" />
            <Flex flexDir="column" gap="0.5rem">
              <Text as="b">{fullName}</Text>
              <Box
                bgColor="gray.300"
                borderRadius="1rem"
                textAlign="center"
                maxW="3rem"
              >
                <Text fontSize="xs">User</Text>
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

const Section3 = ({ userInfo }) => {
  const dateJoined = userInfo ? new Date(userInfo.date_joined) : null;
  const formattedDate = dateJoined
    ? dateJoined.toISOString().split("T")[0]
    : "";
  return (
    <Box>
      <SimpleGrid minChildWidth="400px" column={2} spacing="2" padding="4rem">
        <Box display="flex">
          <Flex alignItems="center" p="2rem">
            <Heading fontSize="4xl">Your Rooms</Heading>
          </Flex>
        </Box>
        <Box p="1rem">
          <Infolayout
            fullName={userInfo ? userInfo.full_name : ""}
            email={userInfo ? userInfo.email : ""}
            date_joined={formattedDate}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
};

const Infolayout = ({ fullName, email, date_joined }) => {
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
              <Text fontSize="sm">{fullName}</Text>
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
              <Text fontSize="sm">{email}</Text>
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
              <Text fontSize="sm">{date_joined}</Text>
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
