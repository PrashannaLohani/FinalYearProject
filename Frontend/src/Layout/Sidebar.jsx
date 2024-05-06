import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Setting from "../Pages/Setting";
import Billing from "../Pages/Billing";
import { FaAngleLeft } from "react-icons/fa6";
import Info from "../Pages/Info";

export default function Sidebar() {
  return (
    <Box maxW="100%" minW="10rem" p="2rem" minH="100vh">
      <Elements />
    </Box>
  );
}

const Elements = () => {
  return (
    <>
      <NavLink to="/info" element={<Info />}>
        <Flex
          alignItems="center"
          _hover={{ color: "gray", transition: "0.4s" }}
          gap="2px"
        >
          <FaAngleLeft style={{ width: "20px", height: "20px" }} />
          <Text as="b" fontSize="xl">
            Back
          </Text>
        </Flex>
      </NavLink>
      <Heading size="md" mt="2rem">
        My profile
      </Heading>
      <Flex gap="1rem" flexDir="column" mt="1rem">
        <NavLink to="/Setting" element={<Setting />} activeClassName="active">
          <Text fontSize="lg" as="a" cursor="pointer">
            Settings
          </Text>
        </NavLink>
        <NavLink to="/Billing" element={<Billing />}>
          <Text fontSize="lg" cursor="pointer">
            Billing
          </Text>
        </NavLink>
      </Flex>

      {/* <Heading size="md" mt="1.5rem">
        My Team{" "}
        <span>
          <Badge colorScheme="blue">Beta</Badge>
        </span>
      </Heading>
      <Flex gap="1rem" flexDir="column" mt="1rem">
        <Text fontSize="lg" as="a" cursor="pointer">
          Team member
        </Text>
        <Text fontSize="lg" as="a" cursor="pointer">
          Manage member
        </Text>
      </Flex> */}
    </>
  );
};
