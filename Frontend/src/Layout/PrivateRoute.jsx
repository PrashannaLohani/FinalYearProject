import { Navigate, Outlet } from "react-router-dom";
import RootLayout from "./RootLayout";

export default function PrivateRoute() {
  const userInfo = localStorage.getItem("accessToken");
  return userInfo ? <Outlet /> : <Navigate to="/Error" />;
}
