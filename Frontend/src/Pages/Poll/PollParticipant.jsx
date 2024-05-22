import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaChartBar, FaAlignJustify } from "react-icons/fa6";

export default function PollParticipant() {
  return (
    <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
      <PollCode />
      <Box
        minH={{ base: "auto", lg: "80vh" }}
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

  const Poll_id = localStorage.getItem("Poll_Id");
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Poll Code: {Poll_id} </Heading>
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleEndSession}
        >
          Exit
        </Button>
      </Flex>
    </Box>
  );
};

const Main = () => {
  const [pollData, setPollData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        const filteredData = response.data.map((questionData) => {
          const uniqueOptions = Array.from(
            new Set(questionData.poll_options.map((option) => option.options))
          ).map((option) => {
            return questionData.poll_options.find(
              (opt) => opt.options === option
            );
          });
          return { ...questionData, poll_options: uniqueOptions };
        });
        setPollData(filteredData);
        if (filteredData.length > 0) {
          setCurrentQuestion(filteredData[0]);
        }

        // Load selected options from localStorage
        const savedSelectedOptions =
          JSON.parse(localStorage.getItem("selected_options")) || [];
        setSelectedOptions(savedSelectedOptions);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOptionClick = async (question, option) => {
    const updatedSelectedOptions = selectedOptions.filter(
      (item) => item.question !== question
    );
    updatedSelectedOptions.push({ question, selected_option: option });
    setSelectedOptions(updatedSelectedOptions);
    localStorage.setItem(
      "selected_options",
      JSON.stringify(updatedSelectedOptions)
    );

    try {
      const pollCode = localStorage.getItem("Poll_Id");
      await axios.post("http://127.0.0.1:8000/Poll/vote/", {
        poll: pollCode,
        votes: updatedSelectedOptions,
      });
      // Optionally handle success response
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleQuestionClick = (questionData) => {
    setCurrentQuestion(questionData);
    onClose();
  };

  const getSelectedOption = (question) => {
    const selected = selectedOptions.find((item) => item.question === question);
    return selected ? selected.selected_option : null;
  };

  return (
    <>
      <Heading size="lg">
        <Flex alignItems="center" justifyContent="space-between" gap="1rem">
          <Flex alignItems="center" gap="1rem">
            <FaChartBar /> <Text>Ranking</Text>
          </Flex>
          <IconButton
            display={{ base: "center", md: "none" }}
            icon={<FaAlignJustify />}
            onClick={onOpen}
            aria-label="View Questions"
            size="lg"
          />
        </Flex>
      </Heading>
      <Tabs
        display={{ base: "none", md: "block" }}
        isFitted
        variant="enclosed"
        mt="1rem"
      >
        <TabList mb="1em">
          {pollData.map((data, index) => (
            <Tab key={index} onClick={() => handleQuestionClick(data)}>
              {data.question}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Box mt="2rem">
        {currentQuestion && (
          <>
            <Heading size={{ base: "lg", lg: "xl" }}>
              {currentQuestion.question}
            </Heading>
            <SimpleGrid
              columns={2}
              spacing={10}
              minChildWidth={{ base: "200px", md: "400px", lg: "600px" }}
              mt="5rem"
            >
              {currentQuestion.poll_options.map((option, idx) => (
                <Button
                  key={idx}
                  bgColor={backgroundColor[idx % backgroundColor.length]}
                  minH="4rem"
                  onClick={() =>
                    handleOptionClick(currentQuestion.question, option.options)
                  }
                  isDisabled={
                    getSelectedOption(currentQuestion.question) !== null
                  }
                  opacity={
                    getSelectedOption(currentQuestion.question) !== null &&
                    getSelectedOption(currentQuestion.question) !==
                      option.options
                      ? 0.5
                      : 1
                  }
                >
                  {option.options}
                </Button>
              ))}
            </SimpleGrid>
            {getSelectedOption(currentQuestion.question) && (
              <Flex justifyContent="center">
                <Text mt="2rem" fontSize="xl" color="green.500">
                  Thank you for your response!
                </Text>
              </Flex>
            )}
          </>
        )}
      </Box>
      {/* Drawer for Questions */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Questions</DrawerHeader>
          <DrawerBody>
            {pollData.map((data, index) => (
              <Box
                key={index}
                mb="1rem"
                p="1rem"
                bg="gray.100"
                borderRadius="md"
                onClick={() => handleQuestionClick(data)}
                cursor="pointer"
              >
                <Heading size="md">{data.question}</Heading>
              </Box>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
