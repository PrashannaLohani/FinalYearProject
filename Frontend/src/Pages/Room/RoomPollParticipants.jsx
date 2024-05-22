import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChartBar } from "react-icons/fa6";
export default function PollParticipant() {
  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <PollCode />
      <Box
        minH={{ base: "auto", lg: "100vh" }}
        borderRadius="2rem"
        boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
        minW="20rem"
        p="2rem"
      >
        <Main />
      </Box>
    </Box>
  );
}

const PollCode = () => {
  const handleEndSession = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      window.location.href = "/info";
    } else {
      window.location.href = "/";
    }
  };

  const Main = () => {
    const [pollData, setPollData] = useState(null);
    const [question, setQuestion] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const backgroundColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(0, 128, 0, 1)",
      "rgba(255, 0, 255, 1)",
    ];

    useEffect(() => {
      const fetchData = async () => {
        try {
          const pollCode = localStorage.getItem("Poll_Id");
          const response = await axios.get(
            "http://127.0.0.1:8000/Poll/participantoption/",
            {
              params: {
                poll_id: pollCode,
              },
            }
          );
          setPollData(response.data.poll_options);
          setQuestion(response.data.question);
        } catch (error) {
          console.error("Error fetching poll data:", error);
        }
      };

      fetchData();
    }, []);

    const handleOptionClick = async (option) => {
      setSelectedOption(option);
      try {
        const pollCode = localStorage.getItem("Poll_Id");
        const response = await axios.post("http://127.0.0.1:8000/Poll/vote/", {
          poll_id: pollCode,
          question: question,
          selected_option: option,
        });
        console.log(response.data); // Optionally handle success response
        setSelectedOption([...selectedOption, option]);
      } catch (error) {
        console.error("Error voting:", error);
      }
    };

    return (
      <>
        <Heading size="lg">
          <Flex alignItems="center" gap="1rem">
            <FaChartBar /> <Text>Ranking</Text>
          </Flex>
        </Heading>
        <Heading mt="2rem" size={{ base: "lg", lg: "xl" }}>
          {question}
        </Heading>
        <Divider mt="1rem" />
        <Box mt="2rem">
          <SimpleGrid
            columns={2}
            spacing={10}
            minChildWidth={{ base: "200px", md: "400px", lg: "600px" }}
          >
            {pollData &&
              pollData.map((option, index) => (
                <Button
                  key={index}
                  bgColor={backgroundColor[index % backgroundColor.length]}
                  minH="4rem"
                  onClick={() => handleOptionClick(option.options)}
                  isDisabled={selectedOption !== null}
                >
                  {option.options}
                </Button>
              ))}
          </SimpleGrid>
        </Box>
      </>
    );
  };
};
