import { Box, Flex, Spacer, TabList, Tabs, Text, Tab } from "@chakra-ui/react";
import Info from "../Pages/Info";
import { NavLink } from "react-router-dom";
import Profile from "../Pages/Profile";

export default function Navbar() {
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
          <TabLayout />
        </Flex>
      </Flex>
      <hr />
    </>
  );
}

const TabLayout = () => {
  return (
    <>
      <Box>
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <NavLink to="/Info" element={<Info />}>
              <Tab>Home</Tab>
            </NavLink>

            <Tab>Create Room</Tab>

            <Tab>Code Generation</Tab>
            <NavLink to="/Profile" element={<Profile />}>
              <Tab>User Profile</Tab>
            </NavLink>
            <Tab>Logout</Tab>
          </TabList>
        </Tabs>
      </Box>
    </>
  );
};
