import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { Form } from "react-router-dom";

export default function CreateRoom() {
  return (
    <>
      <Box minH="100vh">
        <Section1 />
        <hr />
        <Section2 />
      </Box>
    </>
  );
}

const Section1 = () => {
  return (
    <>
      <Box my="2rem">
        <Flex
          justifyContent="center"
          alignItems="center"
          mt="2rem"
          flexDir="column"
        >
          <Heading>Code Generation Panel</Heading>
          <Text>Dynamically generate code for the room or session</Text>
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          mt="2rem"
        >
          <Input
            fontSize="5xl"
            placeholder="X X X X X X"
            p="2rem"
            isReadOnly
            maxW="30rem"
            textAlign="center"
          ></Input>

          <Button
            type="submit"
            minW="6rem"
            mt="1rem"
            bgColor="black"
            colorScheme="blackAlpha"
          >
            Generate
          </Button>
        </Flex>
      </Box>
    </>
  );
};

const Section2 = () => {
  return (
    <Box my="5rem">
      <Flex
        justifyContent="center"
        alignItems="center"
        mt="2rem"
        flexDir="column"
      >
        <Heading>Join the Room</Heading>
        <Text>Join the room with the code</Text>
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        mt="2rem"
      >
        <Formik
          initialValues={{ roomCode: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.roomCode) {
              errors.roomCode = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            // Handle form submission here
            console.log(values.roomCode);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex
                justifyContent="center"
                alignItems="center"
                gap="1rem"
                flexDir="column"
              >
                <Field name="roomCode">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.roomCode && form.touched.roomCode}
                    >
                      <FormLabel htmlFor="roomCode" textAlign="center">
                        Enter your room code
                      </FormLabel>

                      <Input
                        {...field}
                        id="roomCode"
                        type="text"
                        placeholder="XXXXXX"
                        maxW="25rem"
                        textAlign="center"
                      />
                      <FormErrorMessage>
                        {form.errors.roomCode}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  type="submit"
                  bgColor="black"
                  colorScheme="blackAlpha"
                  minW="5rem"
                  isLoading={isSubmitting}
                >
                  Join
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
};
