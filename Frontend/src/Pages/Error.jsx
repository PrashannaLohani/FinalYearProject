import { Box, Text, Image } from "@chakra-ui/react";

export default function Error() {
  return (
    <Box textAlign="center">
      <Heading />
    </Box>
  );
}

const Heading = () => {
  return (
    <Box mt="4">
      <Text fontSize="2xl" fontWeight="bold" color="red.500">
        Oops! Something went wrong.
      </Text>
      <Text fontSize="lg" mt="2">
        We couldn't find the page you're looking for.
      </Text>
    </Box>
  );
};
