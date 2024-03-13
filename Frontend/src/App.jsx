import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Error from "./Pages/Error";
import Info from "./Pages/Info";
import Profile from "./Pages/Profile";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/terms&service";
import CreateRoom from "./Pages/CreateRoom";
import EmailVerification from "./Pages/Forget Password/EmailVerification";
import UpdatePassword from "./Pages/Forget Password/UpdatePassword";
import Setting from "./Pages/Setting";
import Billing from "./Pages/Billing";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Privacy-Policy" element={<Privacy />} />
        <Route path="/Terms&Services" element={<Terms />} />
        <Route path="/EmailVerificaiton" element={<EmailVerification />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/Billing" element={<Billing />} />
        <Route
          path={`/update-password/:uidb64/:token`}
          element={<UpdatePassword />}
        />
        <Route path="/" element={<RootLayout />}>
          <Route path="/Info" element={<Info />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/CreateRoom" element={<CreateRoom />} />
          <Route Component={Error} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
