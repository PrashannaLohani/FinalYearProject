import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";

import { FaStar } from "react-icons/fa6";

export default function Billing() {
  return (
    <Box>
      <Navbar />
      <Grid templateColumns="1fr 3fr">
        <Sidebar />
        <Bills />
      </Grid>
    </Box>
  );
}

const Bills = () => {
  return (
    <Box minH="100vh" padding="3rem">
      <Heading size="lg">Billing</Heading>
      <Box mt="3rem">
        <Text as="b">Currently using our Free plan</Text>
        <Flex alignItems="center" gap="2rem" my="2rem">
          <Text maxW="50%">
            Do you want to ask as many questions as you want? Or would you want
            to incorporate your own branding while coediting presentations with
            others? Look through our premium plans to select the right one for
            you.
          </Text>
          <Button
            leftIcon={<FaStar />}
            _hover={{ bgColor: "blue.200", color: "yellow" }}
            transition="all 0.4s"
            borderRadius="2rem"
            color="white"
            bgColor="black"
          >
            Upgrade
          </Button>
        </Flex>
      </Box>
      <hr />
    </Box>
  );
};
