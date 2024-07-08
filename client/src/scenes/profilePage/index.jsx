import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserWidget from "scenes/widgets/UserWidget";
import AppAppBar from "components/AppAppBar";
import Bookings from "scenes/widgets/Bookings";
import FlexBetween from "components/FlexBetween";
import AvailableJobs from "scenes/widgets/AvailableJobs";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async (id) => {
    const response = await fetch(`/users/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    const id = userId || currentUser.id; // Use the current user's ID if no userId is provided in the URL
    getUser(id);
  }, [userId, currentUser.id, token]); // Added dependencies

  if (!user) return null; // Return null while waiting for user data

  return (
    <FlexBetween>
      <AppAppBar />
      <Box
        mt="100px"
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="5rem"
      >
        <UserWidget userId={user.id} />
        <Box className="flex flex-col gap-10">
          <Bookings />
          {user.type == "worker" && <AvailableJobs />}
        </Box>
      </Box>
    </FlexBetween>
  );
};

export default ProfilePage;
