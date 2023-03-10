import { useState } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { MaterialUISwitch } from "components/SwitchTheme";
import { useThemeStore } from "stores/themeStore";
import { useAuthStore } from "stores/userStore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ExitToApp } from "@mui/icons-material";

export function HeaderUser() {
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore((state) => state);
  const user = useAuthStore((state) => state.user);

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const logOut = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("prestativ-user");
    navigate("/");
  };

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          cursor: "pointer",
        }}
        onClick={() => setIsShow((prevState) => !prevState)}
      >
        <Typography>{`${user.name} ${user.surname}`}</Typography>
        <Avatar
          alt="avatar"
          {...stringAvatar(`${user.name} ${user.surname}`)}
        />
      </Box>

      <Box
        sx={{
          width: "220px",
          position: "absolute",
          backgroundColor: theme ? "white" : "black",
          top: 60,
          right: -5,
          borderRadius: "0.5rem",
          border: "1px solid gray",
          padding: "0.7rem",
          display: isShow ? "flex" : "none",
          flexDirection: "column",
          gap: "0.7rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MaterialUISwitch checked={theme} onChange={toggleTheme} />
          <Typography variant="inherit" color={!theme ? "white" : "black"}>
            Tema escolhido
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          onClick={logOut}
        >
          <ExitToApp fontSize="large" color="warning" />
          <Typography variant="inherit" color={!theme ? "white" : "black"}>
            Sair
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
