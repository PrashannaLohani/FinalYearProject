import { Box, Heading, Text } from "@chakra-ui/react";

export default function Profile() {
  return (
    <>
      <Box minH="100vh">
        <Box>
          <Section1 />
        </Box>
      </Box>
    </>
  );
}

const Section1 = () => {
  return (
    <Box bgColor="red" textAlign="center" mt="2rem">
      <Heading>User Profile</Heading>
      <Text>View and update your profile Information.</Text>
    </Box>
  );
};
