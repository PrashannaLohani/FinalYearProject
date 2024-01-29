import { Box, Text } from "@chakra-ui/react";

export default function Error() {
  return (
    <>
      <Box>
        <Heading />
      </Box>
    </>
  );
}

const Heading = () => {
  return (
    <Box>
      <Text>Page Not Found</Text>
    </Box>
  );
};
