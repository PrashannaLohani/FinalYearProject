import {
  Box,
  Flex,
  Spacer,
  TabList,
  Tabs,
  Tab,
  Image,
  Avatar,
} from "@chakra-ui/react";

import { NavLink } from "react-router-dom";
import Home from "../Pages/Home";
import CustomAvatar from "../Components/Avatar";

export default function Navbar() {
  return (
    <>
      <Box px="1rem">
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
            <AvatarLayout />
          </Flex>
        </Flex>
      </Box>
      <hr />
    </>
  );
}

const AvatarLayout = () => {
  return <CustomAvatar />;
};
