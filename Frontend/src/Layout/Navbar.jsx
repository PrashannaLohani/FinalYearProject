import {
  Box,
  Flex,
  Spacer,
  Image,
  Menu,
  MenuButton,
  IconButton,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";

import { FaStar, FaScrewdriverWrench, FaUsers } from "react-icons/fa6";

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
  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton as={IconButton} borderRadius="2rem">
          <CustomAvatar />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Details"></MenuGroup>
          <MenuGroup title="Personal">
            <MenuItem
              as="a"
              icon={<FaScrewdriverWrench />}
              href="#"
              minWidth="240px"
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              border="none"
              _hover={{ bg: "black", color: "white" }}
            >
              Setting
            </MenuItem>
            <MenuItem
              as="a"
              icon={<FaUsers />}
              href="#"
              minWidth="240px"
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              border="none"
              _hover={{ bg: "black", color: "white" }}
            >
              Team members
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Billing">
            <MenuItem
              as="a"
              icon={<FaStar />}
              href="#"
              minWidth="240px"
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              border="none"
              _hover={{ bg: "blue.300", color: "yellow" }}
            >
              Upgrade to Preminum
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};
