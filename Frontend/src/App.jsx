import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  useNavigate,
} from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Error from "./Pages/Error";
import Info from "./Pages/Info";
import Terms from "./Pages/terms&service";
import CreateRoom from "./Pages/Room/CreateRoom";
import EmailVerification from "./Pages/Forget Password/EmailVerification";
import UpdatePassword from "./Pages/Forget Password/UpdatePassword";
import Setting from "./Pages/Setting";
import Billing from "./Pages/Billing";
import ParticipantRoom from "./Pages/Room/Room_Participants";
import RoomPresenter from "./Pages/Room/Room_Presenter";
import { useState } from "react";
import CreatePoll from "./Pages/Poll/CreatePoll";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Terms&Services" element={<Terms />} />
        <Route path="/EmailVerificaiton" element={<EmailVerification />} />
        <Route
          path={`/update-password/:uidb64/:token`}
          element={<UpdatePassword />}
        />
        <Route path="/" element={<RootLayout />}>
          <Route path="/Info" element={<Info />} />
          <Route path="/CreateRoom" element={<CreateRoom />} />
          <Route path="/CreatePoll" element={<CreatePoll />} />
          <Route path="/RoomPresenter" element={<RoomPresenter />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/Billing" element={<Billing />} />
          <Route Component={Error} />
        </Route>
        <Route path="/ParticipantRoom" element={<ParticipantRoom />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
