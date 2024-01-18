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
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
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
          <Button
            colorScheme="blackAlpha"
            borderRadius="8"
            backgroundColor="black"
          >
            Login
          </Button>
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
              Features
            </Text>
          </Flex>
          <Flex
            maxW="1200px"
            p="2rem"
            justifyContent="space-between"
            gap="1rem"
          >
            <Card>
              <Image src="./Image/Feature1.jpg" maxW="22rem" />
              <CardBody>
                <Text>
                  View a summary of all your customers over the last month.
                </Text>
              </CardBody>
              <CardFooter>
                <Button>View here</Button>
              </CardFooter>
            </Card>
            <Card>
              <Image src="./Image/Feature1.jpg" maxW="22rem" />
              <CardBody>
                <Text>
                  View a summary of all your customers over the last month.
                </Text>
              </CardBody>
              <CardFooter>
                <Button>View here</Button>
              </CardFooter>
            </Card>
            <Card>
              <Image src="./Image/Feature1.jpg" maxW="22rem" />
              <CardBody>
                <Text>
                  View a summary of all your customers over the last month.
                </Text>
              </CardBody>
              <CardFooter>
                <Button>View here</Button>
              </CardFooter>
            </Card>
          </Flex>
        </Box>
      </Flex>
      <footer>
        <Flex gap="1.5rem" justifyContent="center" flexWrap="wrap" mt="2rem">
          <Text>Contact: plohani2003@gmail.com</Text>
          <Text>Privacy policy</Text>
          <Text>Terms of Service</Text>
          <Text>2024 React&Rise. All right reserved.</Text>
        </Flex>
      </footer>
    </>
  );
}
