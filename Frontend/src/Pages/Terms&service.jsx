import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export default function Terms({ isOpen, onClose }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold">
            Terms & Services
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              p="2rem"
              textAlign="left"
              fontSize="lg"
              overflow="auto"
              maxH="30rem"
            >
              <Text>
                These Terms and Conditions govern your use of the React&Rise web
                application operated by React&Rise . This Agreement sets forth
                the legally binding terms and conditions for your use of the
                Service at React&Rise.com.
                <br />
                By accessing or using the Service in any manner, including but
                not limited to visiting or browsing the Service, you agree to be
                bound by these Terms. Capitalized terms are defined in this
                Agreement.
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Use of the Service
              </Text>
              <Text>
                <li>
                  Eligibility: You must be at least 18 years old to use the
                  Service. By using the Service, you represent and warrant that
                  you are at least 18 years old.
                </li>
                <li>
                  License: Subject to your compliance with these Terms, we grant
                  you a limited, non-exclusive, non-transferable, revocable
                  license to access and use the Service for your personal or
                  internal business purposes. You may not resell or sublicense
                  the Service or any part of it.
                </li>
                <li>
                  User Accounts: You may need to create a user account to access
                  certain features of the Service. You are responsible for
                  maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account
                </li>
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Content
              </Text>
              <Text>
                <li>
                  User Content: You are solely responsible for the content you
                  upload, transmit, or display through the Service ("User
                  Content"). You retain ownership of any intellectual property
                  rights that you hold in your User Content.
                </li>
                <li>
                  Prohibited Content: You agree not to upload, transmit, or
                  display any User Content that is unlawful, infringing,
                  offensive, or otherwise violates these Terms or applicable
                  laws.
                </li>
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Intellectual Property
              </Text>
              <Text>
                React&Rise may collect and use Users' personal information for
                the following purposes:
                <li>
                  Ownership: All rights, title, and interest in and to the
                  Service, including all intellectual property rights, are owned
                  by or licensed to React&Rise. Except for the limited license
                  granted to you under these Terms, no other rights are granted
                  to you, whether express or implied.
                </li>
                <li>
                  Feedback: If you provide any feedback, suggestions, or ideas
                  about the Service ("Feedback"), you grant us a perpetual,
                  irrevocable, royalty-free license to use and incorporate such
                  Feedback into the Service without any obligation to you.
                </li>
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Limitation of Liability
              </Text>
              <Text>
                <li>
                  Disclaimer: The Service is provided on an "as is" and "as
                  available" basis without warranties of any kind, either
                  express or implied. We do not warrant that the Service will be
                  uninterrupted, secure, or error-free.
                </li>
                <li>
                  Limitation of Liability: In no event shall React&Rise, its
                  directors, officers, employees, or agents be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages arising out of or in connection with your use of the
                  Service.
                </li>
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Governing Law
              </Text>
              <Text>
                These Terms shall be governed by and construed in accordance
                with the laws of [Your Jurisdiction], without regard to its
                conflict of law provisions.
              </Text>
              <br />
              <Text as="b" fontSize="xl">
                Changes to This Agreement
              </Text>
              <Text>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </Text>
              <br />

              <Text as="b" fontSize="xl">
                Contacting Us:
              </Text>
              <Text>
                If you have any questions about this Privacy Policy, the
                practices of this App, or your dealings with this App, please
                contact us at:{" "}
                <span style={{ fontWeight: "bold" }}>
                  reactrise23@gmail.com
                </span>
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
