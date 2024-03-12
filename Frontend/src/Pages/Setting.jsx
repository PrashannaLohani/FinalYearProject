import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useUserInfo } from "../Components/UserInfo";
import Logout from "../Components/Logout";
import Delete from "../Components/DeleteUser";

export default function Setting() {
  return (
    <Box>
      <Navbar />
      <Grid templateColumns="1fr 3fr">
        <Sidebar />
        <Content />
      </Grid>
    </Box>
  );
}
const Content = () => {
  const userInfo = useUserInfo();
  const { full_name, email } = userInfo || {};
  const {
    isOpen: logoutIsOpen,
    onOpen: logoutOnOpen,
    onClose: logoutOnClose,
  } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();
  const handleLogout = () => {
    logoutOnOpen();
  };
  const handleDelete = () => {
    deleteOnOpen();
  };
  return (
    <>
      <Box minH="100vh" padding="3rem">
        <Heading size="lg">Account Settings</Heading>

        <Accordion allowToggle mt="2rem">
          <AccordionItem sx={{ border: "none" }}>
            <h2>
              <AccordionButton>
                <Flex flexDir="column">
                  <Box as="span" textAlign="left" fontWeight="bold">
                    Name&Image
                    <span>
                      <AccordionIcon />
                    </span>
                  </Box>

                  <Text display="flex" alignItems="center">
                    Logged in as{" "}
                    <span style={{ marginLeft: "5px", fontWeight: "Bold" }}>
                      {full_name}
                    </span>
                  </Text>
                </Flex>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem">
            <h2>
              <AccordionButton>
                <Flex flexDir="column">
                  <Box as="span" textAlign="left" fontWeight="bold">
                    Email
                    <span>
                      <AccordionIcon />
                    </span>
                  </Box>

                  <Text display="flex" alignItems="center">
                    Your email is{" "}
                    <span style={{ marginLeft: "5px", fontWeight: "Bold" }}>
                      {email}
                    </span>
                  </Text>
                </Flex>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              You have logged in with {email}. If you want to change the
              Information then{" "}
              <span>
                <Link as="b">Click here!</Link>
              </span>
            </AccordionPanel>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem">
            <h2>
              <AccordionButton>
                <Flex flexDir="column">
                  <Box as="span" textAlign="left" fontWeight="bold">
                    Password
                    <span>
                      <AccordionIcon />
                    </span>
                  </Box>
                </Flex>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              If you wanna change your existing password then{" "}
              <span>
                <Link as="b">Click here!</Link>
              </span>
            </AccordionPanel>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem">
            <h2>
              <AccordionButton>
                <Flex flexDir="column" justifyItems="center">
                  <Box as="span" textAlign="left" fontWeight="bold">
                    Background{" "}
                    <span>
                      <Badge colorScheme="blue">Beta</Badge>
                      <AccordionIcon />
                    </span>
                  </Box>
                  <Text display="flex" alignItems="center">
                    You are using light background{" "}
                  </Text>
                </Flex>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{/* #### */}</AccordionPanel>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem" pl="1rem">
            <h2>
              <Flex flexDir="column">
                <Box as="span" textAlign="left" fontWeight="bold">
                  Logout
                </Box>
                <Text display="flex" alignItems="center">
                  {" "}
                  You can succesfully log out of your account by clicking the
                  button below.{" "}
                </Text>
                <Button
                  colorScheme="blackAlpha"
                  bgColor="black"
                  maxW="5rem"
                  my="1rem"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Flex>
            </h2>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem" pl="1rem">
            <h2>
              <Flex flexDir="column">
                <Box as="span" textAlign="left" fontWeight="bold">
                  Delete account
                </Box>
                <Text display="flex" alignItems="center">
                  If you want to permanently delete the account.
                </Text>
                <Button
                  colorScheme="red"
                  maxW="5rem"
                  my="1rem"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Flex>
            </h2>
          </AccordionItem>
        </Accordion>
      </Box>
      <Logout isOpen={logoutIsOpen} onClose={logoutOnClose} />
      <Delete isOpen={deleteIsOpen} onClose={deleteOnClose} />
    </>
  );
};
