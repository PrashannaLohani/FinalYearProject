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

import {
  FaStar,
  FaScrewdriverWrench,
  FaUsers,
  FaDoorOpen,
} from "react-icons/fa6";

import { NavLink } from "react-router-dom";
import Home from "../Pages/Home";
import CustomAvatar from "../Components/Avatar";
import { useUserInfo } from "../Components/UserInfo";

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
  const userInfo = useUserInfo();
  const { full_name, email } = userInfo || {};
  return (
    <>
      <Menu closeOnSelect={false}>
        <MenuButton as={IconButton} borderRadius="2rem">
          <CustomAvatar />
        </MenuButton>
        <MenuList>
          <MenuGroup isHoverable={false}>
            <MenuItem
              fontWeight="bold"
              fontSize="lg"
              style={{ pointerEvents: "none" }}
            >
              {full_name}
            </MenuItem>
            <MenuItem
              color="gray.400"
              fontSize="sm"
              style={{ pointerEvents: "none" }}
            >
              {email}
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
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
          <MenuDivider />
          <MenuItem
            icon={<FaDoorOpen />}
            minWidth="240px"
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            border="none"
            _hover={{ bg: "black", color: "white" }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
