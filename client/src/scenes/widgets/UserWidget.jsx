import {
  EditOutlined,
  LocationOnOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween.jsx";
import WidgetWrapper from "components/WidgetWrapper.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { Person } from "@mui/icons-material";


const UserWidget = ({ userId, picturePath }) => {
  const isCurrentUser = useSelector((state) => state.user.id) === userId
  const currentUser = useSelector((state) => state.user)
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }
  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem">
          <Person className="border-2" sx={{width:"70px", height: "70px", borderRadius: "50%"}} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="bold"
              sx={{
                "&:hover": {                  
                  cursor: "pointer",
                },
              }}
            >
              {user.firstname} {user.lastname}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        {user.location && (
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user.location}</Typography>
        </Box>
        )}
        {user.phone && (
        <Box display="flex" alignItems="center" gap="1rem">
          <PhoneOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user.phone}</Typography>
        </Box>
        )}
      </Box>

      <Divider />

      {/* THIRD ROW */}
      {currentUser.type === 'worker' && (
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Overall Rating</Typography>
          <Rating name="read-only" value={4} readOnly/>
        </FlexBetween>
      </Box>
      )}

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          {isCurrentUser && <EditOutlined sx={{ color: main }} />}
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          {isCurrentUser && <EditOutlined sx={{ color: main }} />}
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
