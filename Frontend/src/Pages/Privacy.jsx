import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function Privacy() {
  return (
    <>
      <Box minH="100vh">
        <Navbar />
        <hr />
        <PrivacyHeader />
        <PrivacyDesc />
        <Footer />
      </Box>
    </>
  );
}

const PrivacyHeader = () => {
  return (
    <Flex justifyContent="center">
      <Box mt="2rem">
        <Heading>Privacy Policy</Heading>
      </Box>
    </Flex>
  );
};

const PrivacyDesc = () => {
  return (
    <Box mt="2rem" p="2rem" textAlign="left" fontSize="lg">
      <Text>
        This Privacy Policy governs the manner in which React&Rise collects,
        uses, maintains, and discloses information collected from users of the
        React&Rise . This Privacy Policy applies to the App and all products and
        services offered by React&Rise.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Personal Identification Information:
      </Text>
      <Text>
        React&Rise may collect personal identification information from Users in
        a variety of ways, including, but not limited to, when Users interact
        with the App's features. Users may be asked for, as appropriate, name,
        email address, phone number, and other relevant information. Users may
        visit the App anonymously. React&Rise will collect personal
        identification information from Users only if they voluntarily submit
        such information to us. Users can always refuse to supply personally
        identification information, except that it may prevent them from
        engaging in certain App-related activities.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Non-personal Identification Information:
      </Text>
      <Text>
        React&Rise may collect non-personal identification information about
        Users whenever they interact with the App. Non-personal identification
        information may include the browser name, the type of device and
        technical information about Users' means of connection to the App, such
        as the operating system and the Internet service providers utilized and
        other similar information.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        How We Use Collected Information:
      </Text>
      <Text>
        React&Rise may collect and use Users' personal information for the
        following purposes:
        <li>
          To personalize user experience: We may use information in the
          aggregate to understand how our Users as a group use the services and
          resources provided on the App.
        </li>
        <li>
          To improve our App: We continually strive to improve our offerings
          based on the information and feedback we receive from you.
        </li>
        <li>
          To send periodic emails: We may use the email address to send User
          information and updates pertaining to their order. It may also be used
          to respond to their inquiries, questions, and/or other requests.
        </li>
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        How We Protect Your Information:
      </Text>
      <Text>
        We adopt appropriate data collection, storage, and processing practices
        and security measures to protect against unauthorized access,
        alteration, disclosure, or destruction of your personal information,
        username, password, transaction information, and data stored on our App.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Sharing Your Personal Information:
      </Text>
      <Text>
        We do not sell, trade, or rent Users' personal identification
        information to others. We may share generic aggregated demographic
        information not linked to any personal identification information
        regarding visitors and users with our business partners, trusted
        affiliates, and advertisers for the purposes outlined above.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Changes to This Privacy Policy:
      </Text>
      <Text>
        React&Rise has the discretion to update this Privacy Policy at any time.
        When we do, we will post a notification on the main page of our App. We
        encourage Users to frequently check this page for any changes to stay
        informed about how we are helping to protect the personal information we
        collect. You acknowledge and agree that it is your responsibility to
        review this Privacy Policy periodically and become aware of
        modifications.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Your Acceptance of These Terms:
      </Text>
      <Text>
        By using this App, you signify your acceptance of this Privacy Policy.
        If you do not agree to this Privacy Policy, please do not use our App.
        Your continued use of the App following the posting of changes to this
        Privacy Policy will be deemed your acceptance of those changes.
      </Text>
      <br />
      <Text as="b" fontSize="xl">
        Contacting Us:
      </Text>
      <Text>
        If you have any questions about this Privacy Policy, the practices of
        this App, or your dealings with this App, please contact us at:
      </Text>
    </Box>
  );
};

const Navbar = () => {
  return (
    <Flex margin="1rem" flexWrap="wrap">
      <Box>
        <Text fontSize="2xl" as="b">
          React & Rise
        </Text>
      </Box>
      <Spacer />
      <Flex gap="1rem" flexWrap="wrap">
        <NavLink to="/Login" element={<Login />}>
          <Button
            colorScheme="blackAlpha"
            borderRadius="8"
            backgroundColor="black"
          >
            Login
          </Button>
        </NavLink>
        <NavLink to="/Signup" element={<Signup />}>
          <Button variant="ghost" borderRadius="8">
            Signup
          </Button>
        </NavLink>
      </Flex>
    </Flex>
  );
};

const Footer = () => {
  return (
    <footer>
      <Flex gap="1.5rem" justifyContent="center" flexWrap="wrap" m="2rem">
        <Text>Contact: plohani2003@gmail.com</Text>
        <Text>Privacy policy</Text>
        <Text>Terms of Service</Text>
        <Text>2024 React&Rise.&copy; All right reserved.</Text>
      </Flex>
    </footer>
  );
};
