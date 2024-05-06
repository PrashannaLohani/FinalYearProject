import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";

export default function Logout({ isOpen, onClose }) {
  const handleMenuItemClick = () => {
    window.location.href = "/";
  };
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    const logoutToast = new Promise((resolve, reject) => {
      setTimeout(() => resolve(200), 3000);
    });

    // Display toast based on the promise status
    toast.promise(logoutToast, {
      success: { title: "Logged Out.", description: "Logout successful" },
      loading: { title: "Logging out...", description: "Please wait" },
      error: { title: "Logout failed", description: "Something went wrong" },
    });

    // Redirect after a delay
    setTimeout(() => {
      handleMenuItemClick();
    }, 3000);
  };

  const cancelRef = React.useRef();

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
                color="white"
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
