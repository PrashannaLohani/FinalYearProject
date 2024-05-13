import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PollProgressBar() {
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollCode = localStorage.getItem("Poll_Code");
        const question = localStorage.getItem("question");
        const response = await axios.get(
          "http://127.0.0.1:8000/Poll/options/",
          {
            params: {
              poll_id: pollCode,
              question: question,
            },
          }
        );
        setPollData(response.data.poll_options);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
  }, []);

  if (!pollData) {
    return <div>Loading...</div>;
  }
  return (
    <Box p="2rem">
      {pollData.map((option, index) => {
        return (
          <Flex key={index} alignItems="center" justifyContent="space-between">
            <Flex gap="1rem" alignItems="center">
              <Text fontSize="3xl">{index + 1}.</Text>
              <Text fontSize="3xl">{option.options}</Text>
            </Flex>
            <Text fontSize="3xl">{option.votes}</Text>
            <Progress
              colorScheme="green"
              value={option.votes}
              mx="2rem"
              my="1rem"
              borderRadius="10px"
              h="1rem"
            />
          </Flex>
        );
      })}
    </Box>
  );
}
