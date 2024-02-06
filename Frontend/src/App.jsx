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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Privacy-Policy" element={<Privacy />} />
      <Route path="/Terms&Services" element={<Terms />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="/Info" element={<Info />} />
        <Route path="/Profile" element={<Profile />} />
        <Route Component={Error} />
      </Route>
    </>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
