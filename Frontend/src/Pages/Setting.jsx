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
  Input,
  Link,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../Layout/Sidebar";
import { useUserInfo } from "../Components/UserInfo";
import Logout from "../Components/Logout";
import Delete from "../Components/DeleteUser";
import ChangePassword from "../Components/ChangePassword";
import { useState } from "react";
import axios from "axios";

export default function Setting() {
  return (
    <Box>
      <Grid templateColumns="1fr 3fr">
        <Sidebar />
        <Content />
      </Grid>
    </Box>
  );
}
const Content = () => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const SuccessToast = () => {
    toast({
      title: "Username Updated.",
      description:
        "Your username will be change after another successful login.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleChange = (event) => {
    // Update the newName state with the value entered in the input field
    setNewName(event.target.value);
  };
  const handleNameChange = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      // Make a POST request to update the user's name
      const response = await axios.post(
        "http://127.0.0.1:8000/change-name/",
        {
          name: newName,
        },
        { headers }
      );

      // Check if response is defined and has a data property
      if (response && response.data) {
        SuccessToast();

        // Update the UI or perform any other actions after successful name change
      } else {
        // Handle case where response is undefined or does not have a data property
        console.error(
          "Response is undefined or does not have a data property:",
          response
        );
      }

      setIsLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while processing the request"
      );
      setIsLoading(false);
    }
  };
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
  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose,
  } = useDisclosure();
  const handleLogout = () => {
    logoutOnOpen();
  };
  const handleDelete = () => {
    deleteOnOpen();
  };
  const handleDrawer = () => {
    drawerOnOpen();
  };

  return (
    <>
      <Box minH="100vh" padding="3rem">
        <Heading>Account Settings</Heading>

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
              <Flex gap="1rem" flexDir="column">
                <Input
                  variant="filled"
                  placeholder="New name"
                  value={newName}
                  onChange={handleChange}
                  maxW="20rem"
                  isRequired
                />
                <Button
                  colorScheme="blackAlpha"
                  bgColor="black"
                  onClick={handleNameChange}
                  isLoading={isLoading}
                  maxW="10rem"
                >
                  Save
                </Button>
              </Flex>
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
              You have logged in with {email}
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
                <Link as="b" onClick={handleDrawer}>
                  Click here!
                </Link>
              </span>
            </AccordionPanel>
          </AccordionItem>
          <hr />
          <AccordionItem sx={{ border: "none" }} mt="2rem">
            <h2>
              <AccordionButton>
                <Flex flexDir="column">
                  <Box as="span" textAlign="left" fontWeight="bold">
                    Background <Badge colorScheme="blue">Beta</Badge>
                  </Box>
                  <Text display="flex" alignItems="center">
                    You are using light background{" "}
                  </Text>
                </Flex>
                <AccordionIcon />
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
      <ChangePassword isOpen={drawerIsOpen} onClose={drawerOnClose} />
      <Delete isOpen={deleteIsOpen} onClose={deleteOnClose} />
    </>
  );
};
