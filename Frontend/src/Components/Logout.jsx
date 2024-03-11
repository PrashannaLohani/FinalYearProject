import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";

export default function Logout({ isOpen, onClose }) {
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(refreshToken);
      if (!refreshToken) {
        console.error("Refresh token not found in local storage");
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/logout/", {
        refresh_token: refreshToken,
      });
      console.log(response.data); // Handle successful logout response
    } catch (error) {
      console.error("Logout failed:", error.response.data.error);
      // Handle failed logout response
    }
  };

  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout?
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to Logout?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blackAlpha"
                bgColor="black"
                onClick={handleLogout}
                ml={3}
              >
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
