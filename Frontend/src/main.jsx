import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import "./font.css";
import { UserInfoProvider } from "./Components/UserInfo.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <UserInfoProvider>
        <App />
      </UserInfoProvider>
    </ChakraProvider>
  </React.StrictMode>
);
