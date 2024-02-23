import { Flex, Text } from "@chakra-ui/react";

export default function HomepageFooter() {
  return (
    <footer>
      <Flex gap="1.5rem" justifyContent="center" flexWrap="wrap" m="2rem">
        <Text>Contact: reactrise23@gmail.com</Text>
        <Text>Privacy policy</Text>
        <Text>Terms of Service</Text>
        <Text>2024 React&Rise.&copy; All right reserved.</Text>
      </Flex>
    </footer>
  );
}
