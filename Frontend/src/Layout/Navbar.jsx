import {
  Box,
  Flex,
  Spacer,
  TabList,
  Tabs,
  Text,
  Tab,
  Image,
} from "@chakra-ui/react";
import Info from "../Pages/Info";
import { NavLink } from "react-router-dom";
import Profile from "../Pages/Profile";
import CreateRoom from "../Pages/CreateRoom";
import Home from "../Pages/Home";

export default function Navbar() {
  return (
    <>
      <Flex margin="1rem" flexWrap="wrap" alignItems="center">
        <NavLink to="/" element={<Home />}>
          <Box display="flex" alignItems="center">
            <Image
              width="100%"
              height="50px"
              objectFit="cover"
              src="./Image/React&Rise_Logo.png"
            />
            <Image
              width="100%"
              height="40px"
              objectFit="cover"
              src="./Image/React&Rise_Text.png"
            />
          </Box>
        </NavLink>
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
            <NavLink to="/CreateRoom" element={<CreateRoom />}>
              <Tab>Create Room</Tab>
            </NavLink>

            <NavLink to="/Profile" element={<Profile />}>
              <Tab>User Profile</Tab>
            </NavLink>
            <Tab>About Us</Tab>
            <Tab>Logout</Tab>
          </TabList>
        </Tabs>
      </Box>
    </>
  );
};
