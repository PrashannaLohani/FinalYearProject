import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { useUserInfo } from "../Components/UserInfo";
import CustomAvatar from "../Components/Avatar";
import { Link } from "react-router-dom";

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
  return (
    <Box minH="100vh" padding="3rem">
      <Heading size="lg">Account Settings</Heading>

      <Accordion allowMultiple mt="2rem">
        <AccordionItem sx={{ border: "none" }}>
          <h2>
            <AccordionButton>
              <Flex flexDir="column">
                <Box as="span" textAlign="left">
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
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
        <hr />
        <AccordionItem sx={{ border: "none" }} mt="1rem">
          <h2>
            <AccordionButton>
              <Flex flexDir="column">
                <Box as="span" textAlign="left">
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
              <a>Click here!</a>
            </span>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <hr />
    </Box>
  );
};
