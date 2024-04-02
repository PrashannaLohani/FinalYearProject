import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useUserInfo } from "./UserInfo";

export default function Delete({ isOpen, onClose }) {
  const userInfo = useUserInfo();
  const { email } = userInfo || {};
  const [inputValue, setInputValue] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  useEffect(() => {
    setIsDeleteEnabled(inputValue === email);
  }, [inputValue, email]);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleDelete = () => {
    // Handle delete action here
  };

  const cancelRef = React.useRef();

  useEffect(() => {
    setInputValue(""); // Reset input value when dialog opens
  }, [isOpen]);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to permanently delete your account? Please
              write your email to proceed.
              <Input
                mt="1rem"
                placeholder={email}
                isRequired
                value={inputValue}
                onChange={handleChange}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={handleDelete}
                isDisabled={!isDeleteEnabled}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
