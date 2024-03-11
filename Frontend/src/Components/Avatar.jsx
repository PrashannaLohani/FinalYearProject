import { Avatar } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CustomAvatar() {
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get("http://127.0.0.1:8000/info/", config);

      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  return (
    <>
      {userInfo && userInfo.full_name ? (
        <Avatar name={userInfo.full_name} />
      ) : (
        <Avatar name="Loading..." />
      )}
    </>
  );
}
