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
import { NavLink } from "react-router-dom";
import axios from "axios";
import PollPresent from "./PollPresent";

export default function CreatePoll() {
  const Poll_code = localStorage.getItem("Poll_Code");
  return (
    <>
      <Box minH="100vh" p={{ base: "1rem", md: "3rem", lg: "3rem" }}>
        <PollCode Pollid={Poll_code} />
        <Box
          borderRadius="2rem"
          boxShadow="rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px"
          minW="20rem"
          p="2rem"
        >
          <Headline />
          <Polling Pollid={Poll_code} />
        </Box>
      </Box>
    </>
  );
}

const PollCode = ({ Pollid }) => {
  const handleEndSession = () => {
    localStorage.removeItem("question");
    localStorage.removeItem("pollOptions");
    localStorage.removeItem("Poll_ID");
    window.location.href = "/info";
  };

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Poll Code: {Pollid} </Heading>
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleEndSession}
        >
          End session
        </Button>
      </Flex>
    </Box>
  );
};

const Headline = () => {
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
        <Heading size="lg">
          <Flex alignItems="center" gap="1rem">
            <FaChartBar /> <Text>Ranking</Text>
          </Flex>
        </Heading>
        <NavLink to="/PollPresent">
          <Button leftIcon={<FaTv />} onClick={handlePresentClick}>
            Present
          </Button>
        </NavLink>
      </Flex>
    </>
  );
};

const Polling = ({ Pollid }) => {
  const maxOptions = 8;
  const [isAddOptionDisabled, setIsAddOptionDisabled] = useState(false);
  const [options, setOptions] = useState(
    localStorage.getItem("pollOptions")
      ? localStorage.getItem("pollOptions").split(",")
      : ["Option 1", "Option 2"]
  );

  useEffect(() => {
    localStorage.setItem("pollOptions", options.join(","));
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

  const [question, setQuestion] = useState(
    localStorage.getItem("question") || ""
  );

  useEffect(() => {
    localStorage.setItem("question", question);
  }, [question]);

  const handleQuestionChange = (newValue) => {
    setQuestion(newValue);
  };
  const [isFullscreen, setIsFullscreen] = useState(false);
  const PresentationClick = () => {
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

  const submitPoll = async () => {
    try {
      const Option = localStorage.getItem("pollOptions");
      const Question = localStorage.getItem("question");
      const response = await axios.post("http://127.0.0.1:8000/Poll/create/", {
        poll: Pollid,
        question: Question,
        options: Option,
      });
      PresentationClick();

      console.log(response.data); // Optionally, handle the response data
    } catch (error) {
      console.error("Error submitting poll:", error);
    }
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
      <Box minHeight="auto">
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
          <NavLink to="/PollPresent">
            <Button
              colorScheme="blackAlpha"
              color="white"
              mt="1rem"
              bgColor="black"
              onClick={submitPoll}
            >
              Submit
            </Button>
          </NavLink>

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
