import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/" element={<RootLayout />}></Route>
    </>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
