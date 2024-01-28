import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "./Login";
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
          <Button variant="ghost" borderRadius="8">
            Signup
          </Button>
        </Flex>
      </Flex>
      <hr />
      <Flex justify="center" flexDir="column" alignItems="center">
        <Text as="b" fontSize="4xl" mt="2rem" textAlign="center">
          Welcome to React & Rise
        </Text>
        <Text textAlign="center" mt="1rem">
          The platform where you can interact without hesitation.
        </Text>
        <Button colorScheme="blackAlpha" backgroundColor="black" mt="1rem">
          Get started
        </Button>
      </Flex>
      <Flex height="100vh" justifyContent="center">
        <Box minH="auto" borderRadius="1rem">
          <Flex justifyContent="center">
            <Text fontSize="4xl" as="b" mt="4rem">
              Achieve Sucess with React&Rise
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
            <Card>
              <Image src="./Image/Engagement.jpg" borderRadius="8" />
              <CardHeader>
                <Heading size="lg">Engagement</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  Elevate the level of participation and captivate every
                  audience during your presentations using React&Rise. Embrace
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
      {/* <Box bgImage="./Image/BG.jpg" bgRepeat="no-repeat" bgSize="cover">
        <Flex alignItems="center" height="10rem">
          <Text fontSize="4xl">
            Dazzle your audience with engaging and interactive presentations.
          </Text>
        </Flex>
      </Box> */}
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
