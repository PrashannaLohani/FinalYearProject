import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { Formik, useFormik } from "formik";
import ContactForm from "../Components/Contact";
import HomepageNav from "../Layout/Homepage/HomepageNavbar";
import HomepageFooter from "../Layout/Homepage/HomepageFooter";
import { FaUserGroup, FaChartLine, FaStairs } from "react-icons/fa6";
import { useEffect, useRef } from "react";

export default function Home() {
  // const textRef = useRef(null);

  // useEffect(() => {
  //   gsap.from(textRef.current, { opacity: 0, y: 50, duration: 1, delay: 0.5 });
  // }, []);
  return (
    <>
      <HomepageNav />
      <Box
        minH="100vh"
        minW="30rem"
        my={{ base: "2rem", md: "4rem", lg: "5rem" }}
        mx={{ base: "0.5rem", md: "2rem", lg: "5rem" }}
        justifyContent="center"
      >
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </Box>
      <HomepageFooter />
    </>
  );
}

const Section1 = () => {
  const initialValues = {
    roomCode: "",
  };

  const formik = useFormik({
    initialValues,
    validate: (values) => {
      const errors = {};
      if (!values.roomCode) {
        errors.roomCode = "Room code is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      // Handle form submission with validated values
      console.log(values); // Example: { roomCode: 12345 }
    },
  });
  return (
    <Flex justifyContent="center">
      <Box
        borderRadius="12px"
        width="100%"
        height="30rem"
        backgroundImage="url('./Image/HomeBG.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative" // Add position relative
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgColor="rgba(0, 0, 0, 0.5)" // Semi-transparent black overlay
          borderRadius="12px"
        />
        <Flex
          alignItems="center"
          flexDir="column"
          position="relative"
          zIndex="1"
          gap="1rem"
        >
          <Text
            as="b"
            fontSize="5xl"
            color="white"
            mx="2rem"
            mt="2rem"
            minW="10rem"
            textAlign="center"
          >
            Empowering Presenters, Engaging Audiences.
          </Text>
          <Flex justifyContent="flex-start">
            <Formik form={formik}>
              {({ handleSubmit, handleChange, errors, touched }) => (
                <>
                  <Input
                    textAlign="center"
                    placeholder="XXXXXX"
                    type="number"
                    bg="white"
                    mx="2rem"
                    minW="15rem"
                    onChange={handleChange}
                    style={
                      errors.roomCode && touched.roomCode
                        ? { borderColor: "red" }
                        : null
                    }
                  />
                  {errors.roomCode && touched.roomCode && (
                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                      {errors.roomCode}
                    </p>
                  )}
                  <Button
                    minW="5rem"
                    colorScheme="whiteAlpha"
                    onClick={handleSubmit}
                    disabled={formik.isSubmitting} // Disable button while submitting
                  >
                    Join
                  </Button>
                </>
              )}
            </Formik>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const Section2 = () => {
  return (
    <>
      <Heading mt="2rem" size="2xl">
        Why React&Rise?
      </Heading>
      <Text fontSize="lg" mt="1rem">
        React&Rise is the only platform that combines a cutting-edge developer
        experience with an intuitive UI for non-technical users.
      </Text>
    </>
  );
};

const Section3 = () => {
  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing="1rem" mt="2rem">
        <Card>
          <CardHeader>
            <FaUserGroup style={{ width: "2rem", height: "2rem" }} />
            <Heading size="md" mt="0.5rem">
              Simplify your work flow
            </Heading>
          </CardHeader>
          <CardBody>
            React&Rise simplifies presentations with interactive engagement
            tools for real-time audience interaction and data visualization.
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <FaChartLine style={{ width: "2rem", height: "2rem" }} />
            <Heading size="md" mt="0.5rem">
              Real-time analytics
            </Heading>
          </CardHeader>
          <CardBody>
            React&Rise offers real-time analytics, providing immediate insights
            into audience responses during presentations, meetings, and
            workshops.
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <FaStairs style={{ width: "2rem", height: "2rem" }} />
            <Heading size="md" mt="0.5rem">
              Accessible Excellence
            </Heading>
          </CardHeader>
          <CardBody>
            Our mission is to make top-tier software accessible to all. With our
            platform, excellence in app development is within reach, regardless
            of expertise level.
          </CardBody>
        </Card>
      </SimpleGrid>
    </>
  );
};

const Section4 = () => {
  return (
    <Box mt="4rem" textAlign="center">
      <Heading>About us</Heading>
      <Text mt="1rem">
        Our goal is to streamline the process of developing modern web
        applications, making it quicker, simpler, and more enjoyable. We firmly
        believe that exceptional software should be within reach for everyone,
        not just those with technical expertise. That's why we've developed a
        platform that enables both developers and non-technical individuals to
        create and deploy stunning, efficient applications without the
        complexities of infrastructure management.
      </Text>
    </Box>
  );
};

const Section5 = () => {
  return (
    <Box>
      <ContactForm />
    </Box>
  );
};
