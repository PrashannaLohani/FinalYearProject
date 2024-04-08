import React, { useEffect, useState } from "react";
import { useUserInfo } from "./UserInfo";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";

export default function Delete({ isOpen, onClose }) {
  const userInfo = useUserInfo();
  const { email } = userInfo || {};
  const [inputValue, setInputValue] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleDeleteClick = () => {
    window.location.href = "/"; // Assuming this redirects to the homepage
  };

  const handleDeleteToast = () => {
    const successPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
    toast.promise(successPromise, {
      success: { title: "Delete Successful.", description: "Welcome." },
      loading: { title: "Deleting data...", description: "Hold on...!" },
      error: { title: "Delete failed", description: "Something went wrong" },
    });
  };

  useEffect(() => {
    setIsDeleteEnabled(inputValue === email);
  }, [inputValue, email]);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://127.0.0.1:8000/delete/",
        {
          delete: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.message === "Account deleted successfully.") {
        // Display success toast
        handleDeleteToast();

        // Remove tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Navigate to homepage after a delay
        setTimeout(() => {
          handleDeleteClick();
        }, 3000);
      } else {
        // Handle unsuccessful deletion
        // You may want to display an error message here
      }
    } catch (error) {
      // Handle error
      setError(error.message);
    }
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
