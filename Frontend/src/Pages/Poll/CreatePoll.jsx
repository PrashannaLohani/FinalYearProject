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
  const handleClick = async () => {
    const poll_id = localStorage.getItem("Poll_Code");
    try {
      await axios.post("http://127.0.0.1:8000/Poll/deactivate/", {
        poll_id: poll_id,
        active: false,
      });

      localStorage.removeItem("pollQuestions");
      localStorage.removeItem("Poll_Code");
      window.location.href = "/info";
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" px="2rem">
        <Heading mb="1rem">Poll Code: {Pollid} </Heading>
        <Button
          bgColor="black"
          colorScheme="blackAlpha"
          color="white"
          onClick={handleClick}
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
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("pollQuestions")) || [
      { question: "", options: ["Option 1", "Option 2"] },
    ]
  );

  useEffect(() => {
    localStorage.setItem("pollQuestions", JSON.stringify(questions));
  }, [questions]);

  const handleQuestionChange = (newValue, questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question = newValue;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (newValue, questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = newValue;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length < maxOptions) {
      newQuestions[questionIndex].options.push(
        `Option ${newQuestions[questionIndex].options.length + 1}`
      );
      setQuestions(newQuestions);
    }
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["Option 1", "Option 2"] },
    ]);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const PresentationClick = () => {
    if (!isFullscreen) {
      if (document.fullscreenEnabled) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        console.error("Full-screen mode is not supported.");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  console.log(questions.options);

  const submitPoll = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/Poll/create/", {
        poll: Pollid,
        questions: questions.map((q) => ({
          questions: q.question,
          options: q.options,
        })),
      });
      PresentationClick();

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting poll:", error);
    }
  };

  return (
    <>
      <Box minHeight="auto">
        {questions.map((q, questionIndex) => (
          <Box key={questionIndex} mb="2rem">
            <Editable
              placeholder="Write your question"
              value={q.question}
              style={{ fontSize: "2.5rem" }}
              mt="2rem"
              onChange={(newValue) =>
                handleQuestionChange(newValue, questionIndex)
              }
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
            {q.options.map((option, optionIndex) => (
              <Flex alignItems="center" gap="1rem" mt="2rem" key={optionIndex}>
                <Text>{optionIndex + 1}.</Text>
                <Editable
                  placeholder={`Option ${optionIndex + 1}`}
                  defaultValue={option}
                  onChange={(newValue) =>
                    handleOptionChange(newValue, questionIndex, optionIndex)
                  }
                  minW="80%"
                  border="1px"
                  borderRadius="9px"
                  borderColor="gray.200"
                >
                  <EditablePreview p="1rem" />
                  <EditableInput p="1rem" />
                </Editable>
                {optionIndex >= 2 && (
                  <Button
                    variant="unstyled"
                    ml="1rem"
                    onClick={() => deleteOption(questionIndex, optionIndex)}
                  >
                    <FaTrashCan />
                  </Button>
                )}
              </Flex>
            ))}
            <Button
              leftIcon={<FaPlus />}
              variant="ghost"
              border="1px"
              borderColor="green.500"
              color="gray"
              mt="1rem"
              onClick={() => addOption(questionIndex)}
            >
              <Flex justifyContent="flex-start">Add option</Flex>
            </Button>
          </Box>
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
            onClick={addQuestion}
          >
            Add Question
          </Button>
        </Flex>
      </Box>
    </>
  );
};
