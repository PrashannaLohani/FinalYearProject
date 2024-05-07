import { Box, Flex, Progress, Text } from "@chakra-ui/react";

export default function PollProgressBar() {
  return (
    <Box p="2rem">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap="1rem" alignItems="center">
          <Text fontSize="3xl">1.</Text>
          <Text fontSize="3xl">Option 1</Text>
        </Flex>
        <Text fontSize="3xl">80%</Text>
      </Flex>

      <Progress
        colorScheme="green"
        value={80}
        mx="2rem"
        my="1rem"
        borderRadius="10px"
        h="1rem"
      />
    </Box>
  );
}
