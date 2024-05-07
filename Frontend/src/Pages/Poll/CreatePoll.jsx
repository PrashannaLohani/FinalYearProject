import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import { FaChartBar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaPlus, FaTrashCan, FaTv } from "react-icons/fa6";

export default function CreatePoll() {
  return (
    <>
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
        <Box
          minH="100vh"
          borderRadius="2rem"
          boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
          minW="20rem"
          p="2rem"
        >
          <RoomID />
          <Question />
          <Polling />
        </Box>
      </Box>
    </>
  );
}

const RoomID = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handlePresentClick = () => {
    if (!isFullscreen) {
      if (document.fullscreenEnabled) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Full-screen mode is not supported
        console.error("Full-screen mode is not supported.");
      }
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Flex flexDir="column">
          <Heading size="lg">
            <Flex alignItems="center">
              <FaChartBar /> Ranking
            </Flex>
          </Heading>
          <Text>Vote:</Text>
        </Flex>
        <Button leftIcon={<FaTv />} onClick={handlePresentClick}>
          Present
        </Button>
      </Flex>
    </>
  );
};

const Question = () => {
  const [question, setQuestion] = useState(
    localStorage.getItem("question") || ""
  );

  useEffect(() => {
    localStorage.setItem("question", question);
  }, [question]);

  const handleQuestionChange = (newValue) => {
    setQuestion(newValue);
  };

  return (
    <>
      <Editable
        placeholder="Write your question"
        value={question}
        style={{ fontSize: "2.5rem" }}
        mt="2rem"
        onChange={handleQuestionChange}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </>
  );
};

const Polling = () => {
  const maxOptions = 8;
  const [options, setOptions] = useState(
    JSON.parse(localStorage.getItem("pollOptions")) || ["Option 1", "Option 2"]
  );
  const [isAddOptionDisabled, setIsAddOptionDisabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("pollOptions", JSON.stringify(options));
  }, [options]);

  const addOption = () => {
    if (options.length < maxOptions) {
      const newIndex = options.length + 1;
      setOptions([...options, `Option ${newIndex}`]);
    } else {
      setIsAddOptionDisabled(true);
    }
  };

  const deleteOption = (indexToDelete) => {
    setOptions(options.filter((_, index) => index !== indexToDelete));
    if (options.length === maxOptions) {
      setIsAddOptionDisabled(false); // Re-enable the Add option button after deletion
    }
  };
  return (
    <>
      <Box minHeight="100vh">
        {options.map((option, index) => (
          <Flex alignItems="center" gap="1rem" mt="2rem" key={index}>
            <Text>{index + 1}.</Text>
            <Editable
              placeholder={`Option ${index + 1}`}
              defaultValue={option}
              onChange={(newValue) => {
                const newOptions = [...options];
                newOptions[index] = newValue;
                setOptions(newOptions);
              }}
              minW="80%"
              border="1px"
              borderRadius="9px"
              borderColor="gray.200"
            >
              <EditablePreview p="1rem" />
              <EditableInput p="1rem" />
            </Editable>
            {index >= 2 && ( // Only render icon for options added dynamically after initial two options
              <Button
                variant="unstyled"
                ml="1rem"
                onClick={() => deleteOption(index)}
              >
                <FaTrashCan />
              </Button>
            )}
          </Flex>
        ))}
        <Flex gap="1rem">
          <Button
            colorScheme="blackAlpha"
            color="white"
            mt="1rem"
            bgColor="black"
          >
            Submit
          </Button>
          <Button
            leftIcon={<FaPlus />}
            variant="ghost"
            border="1px"
            borderColor="green.500"
            color="gray"
            mt="1rem"
            onClick={addOption}
            isDisabled={isAddOptionDisabled}
          >
            <Flex justifyContent="flex-start">Add option</Flex>
          </Button>
        </Flex>
      </Box>
    </>
  );
};
