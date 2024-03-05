import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "../../Pages/Login";
import Signup from "../../Pages/Signup";
import Home from "../../Pages/Home";
import { HiOutlineMenuAlt4 } from "react-icons/hi"; // Import the menu icon from `react-icons/hi`

export default function HomepageNav() {
  const [showNav, setShowNav] = useState(false); // Add a state to toggle the visibility of the navbar

  return (
    <Box
      minH="5rem"
      minW="31rem"
      width="100%"
      p={{ base: "5px", md: "10px" }}
      position="sticky"
      top="0"
      zIndex="99"
      bgColor="white"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
    >
      <Flex margin="1rem" flexWrap="wrap" alignItems="center">
        <NavLink to="/" element={<Home />}>
          <Box display="flex" alignItems="center">
            <Image
              width="100%"
              height={{ base: "30px", md: "50px" }}
              objectFit="cover"
              src="./Image/React&Rise_Logo.png"
            />
            <Image
              width="100%"
              height={{ base: "20px", md: "40px" }}
              objectFit="cover"
              src="./Image/React&Rise_Text.png"
            />
          </Box>
        </NavLink>
        <Spacer />
        <Flex
          gap="1rem"
          flexWrap="wrap"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
        >
          <NavLink to="/Login" element={<Login />}>
            <Button
              colorScheme="blackAlpha"
              borderRadius="8"
              backgroundColor="black"
              mt={{ base: "1rem", md: "0" }}
            >
              Login
            </Button>
          </NavLink>
          <NavLink to="/Signup" element={<Signup />}>
            <Button
              variant="ghost"
              borderRadius="8"
              mt={{ base: "1rem", md: "0" }}
            >
              Signup
            </Button>
          </NavLink>
        </Flex>
        <IconButton
          aria-label="Menu"
          icon={<HiOutlineMenuAlt4 />}
          size="md"
          fontSize="2xl"
          variant="ghost"
          onClick={() => setShowNav(!showNav)} // Toggle the visibility of the navbar when the menu icon is clicked
          display={{ base: "flex", md: "none" }}
        />
      </Flex>
      {showNav && ( // Show the navbar when `showNav` is true
        <Flex
          gap="1rem"
          flexWrap="wrap"
          display={{ base: "flex", md: "none" }}
          alignItems="center"
        >
          <NavLink to="/Login" element={<Login />}>
            <Button
              colorScheme="blackAlpha"
              borderRadius="8"
              backgroundColor="black"
              mt={{ base: "1rem", md: "0" }}
            >
              Login
            </Button>
          </NavLink>
          <NavLink to="/Signup" element={<Signup />}>
            <Button
              variant="ghost"
              borderRadius="8"
              mt={{ base: "1rem", md: "0" }}
            >
              Signup
            </Button>
          </NavLink>
        </Flex>
      )}
    </Box>
  );
}
