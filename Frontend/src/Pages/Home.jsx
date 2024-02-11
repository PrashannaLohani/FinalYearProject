import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { Field, Form, Formik } from "formik";
import ContactForm from "../Components/Contact";
export default function Home() {
  return (
    <>
      <Flex margin="1rem" flexWrap="wrap">
        <Box>
          <Text fontSize="2xl" as="b">
            React & Rise
          </Text>
        </Box>
        <Spacer />
        <Flex gap="1rem" flexWrap="wrap">
          <NavLink to="/Login" element={<Login />}>
            <Button
              colorScheme="blackAlpha"
              borderRadius="8"
              backgroundColor="black"
            >
              Login
            </Button>
          </NavLink>
          <NavLink to="/Signup" element={<Signup />}>
            <Button variant="ghost" borderRadius="8">
              Signup
            </Button>
          </NavLink>
        </Flex>
      </Flex>
      <hr />
      <Flex justify="center" flexDir="column" alignItems="center" gap="1rem">
        <Text as="b" fontSize="4xl" mt="2rem" textAlign="center">
          Welcome to React & Rise
        </Text>
        <Text textAlign="center">
          The platform where you can interact without hesitation.
        </Text>
        <Formik
          initialValues={{ roomCode: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.roomCode) {
              errors.roomCode = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            // Handle form submission here
            console.log(values.roomCode);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex
                justifyContent="center"
                alignItems="center"
                gap="1rem"
                flexDir="column"
              >
                <Field name="roomCode">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.roomCode && form.touched.roomCode}
                    >
                      <FormLabel htmlFor="roomCode">
                        Enter your room code
                      </FormLabel>

                      <Input
                        {...field}
                        id="roomCode"
                        type="text"
                        placeholder="XXXXXX"
                        maxW="25rem"
                        textAlign="center"
                      />
                      <FormErrorMessage>
                        {form.errors.roomCode}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  type="submit"
                  bgColor="black"
                  colorScheme="blackAlpha"
                  minW="5rem"
                  isLoading={isSubmitting}
                >
                  Join
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
      <Flex height="100vh" justifyContent="center">
        <Box minH="auto" borderRadius="1rem">
          <Flex justifyContent="center">
            <Text fontSize="4xl" as="b" mt="4rem">
              Achieve Sucess with React & Rise
            </Text>
          </Flex>

          <SimpleGrid
            minChildWidth="400px"
            column={3}
            spacing="2"
            padding="4rem"
          >
            <Card>
              <Image src="./Image/Feature1.jpg" borderRadius="8" />
              <CardHeader>
                <Heading size="lg">Work</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  Enhance the productivity of your work-related meetings by
                  collecting valuable input, feedback, and insights from your
                  colleagues. Collaborate to make more informed decisions as a
                  team!
                </Text>
              </CardBody>
              <CardFooter>
                <Button>Read more</Button>
              </CardFooter>
            </Card>
            <Card>
              <Image src="./Image/Education.jpg" borderRadius="8" />
              <CardHeader>
                <Heading size="lg">Education</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  Improve educational results and actively involve each student
                  in the classroom. Explore contemporary teaching approaches by
                  utilizing the features provided by React&Rise!
                </Text>
              </CardBody>
              <CardFooter>
                <Button>Read more</Button>
              </CardFooter>
            </Card>
            <Card style={{}}>
              <Image src="./Image/Engagement.jpg" borderRadius="8" />
              <CardHeader>
                <Heading size="lg">Engagement</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  Elevate the level of participation and captivate every
                  audience during your presentations using React & Rise. Embrace
                  innovative features to foster engagement and elevate the
                  overall interactive experience for your audience.
                </Text>
              </CardBody>
              <CardFooter>
                <Button>Read more</Button>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </Box>
      </Flex>
      <SimpleGrid minChildWidth="400px" spacing="2" mt="3rem" padding="2rem">
        <Box padding="3rem">
          <Heading mt="3rem" maxW="36rem">
            Transform challenging audiences into actively involved participants.
          </Heading>
          <List mt="2rem">
            <OrderedList spacing="2rem">
              <ListItem>
                Establish an instant rapport with your audience and involve them
                in your presentation to create a meaningful connection.
              </ListItem>
              <ListItem>
                Establish an instant rapport with your audience and involve them
                in your presentation to create a meaningful connection.
              </ListItem>
            </OrderedList>
          </List>
        </Box>
        <Box>
          <Image src="./Image/Crowd.jpg" />
        </Box>
      </SimpleGrid>
      <SimpleGrid minChildWidth="400px" spacing="2" padding="2rem">
        <Box>
          <Image src="./Image/presentation.jpg" />
        </Box>
        <Box padding="3rem">
          <Heading mt="3rem" maxW="36rem">
            Craft presentations that are genuinely distinctive.
          </Heading>
          <List mt="2rem">
            <OrderedList spacing="2rem">
              <ListItem>
                Utilize a diverse set of interactive slides to ask questions,
                collect feedback, and engage with your audience.
              </ListItem>
              <ListItem>
                Create a compelling presentation in a matter of minutes,
                generate a meaningful icebreaker on the spot, or discover
                innovative ways to captivate and involve your audience!
              </ListItem>
            </OrderedList>
          </List>
        </Box>
      </SimpleGrid>
      <Aboutus />
      <Contact />
      <footer>
        <Flex gap="1.5rem" justifyContent="center" flexWrap="wrap" m="2rem">
          <Text>Contact: plohani2003@gmail.com</Text>
          <Text>Privacy policy</Text>
          <Text>Terms of Service</Text>
          <Text>2024 React&Rise.&copy; All right reserved.</Text>
        </Flex>
      </footer>
    </>
  );
}

const Aboutus = () => {
  return (
    <Box mt="3rem">
      <Flex justifyContent="center">
        <Heading size="2xl">About us</Heading>
      </Flex>
      <SimpleGrid minChildWidth="400px" spacing="2" padding="2rem" mt="3rem">
        <Box p="2rem">
          <Heading>Our Dream is Global Learning Transformation</Heading>
          <Flex alignItems="center">
            <Text fontSize="xl" mt="2rem">
              At React&Rise, we are passionate about facilitating meaningful
              communication and collaboration through our innovative web
              application. Our mission is to empower individuals and teams to
              connect, engage, and grow together in a digital environment.
            </Text>
          </Flex>
        </Box>
        <Box>
          <Image src="./Image/aboutus.jpg" />
        </Box>
      </SimpleGrid>
      <SimpleGrid minChildWidth="400px" spacing="2" padding="2rem" mt="3rem">
        <Box px="2rem">
          <Flex justifyContent="flex-end">
            <Image src="./Image/aboutus2.jpg" />
          </Flex>
        </Box>
        <Box p="2rem">
          <Heading>Our Mission</Heading>
          <Flex alignItems="center">
            <Text fontSize="xl" mt="2rem">
              Our mission is to provide a user-friendly and effective platform
              for communication, enabling users to connect, collaborate, and
              succeed in their endeavors.
            </Text>
          </Flex>
          <Button mt="2rem" bgColor="Black" colorScheme="blackAlpha">
            Learn More
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

const Contact = () => {
  return <ContactForm />;
};
