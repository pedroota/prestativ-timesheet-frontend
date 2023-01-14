import { Box, Avatar, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { decodeJwt } from "utils/decodeJwt";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "services/auth.service";

interface JWTDecodified {
  id: string;
  role: string;
}

export function HeaderUser() {
  const { user } = useContext(AuthContext);
  const currentUser: JWTDecodified = decodeJwt(`${user}`);
  const { data: singleUser } = useQuery(["user", currentUser.id], () =>
    getUserById(currentUser.id)
  );

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

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <Typography>{`${singleUser?.data.user.name} ${singleUser?.data.user.surname}`}</Typography>
      <Avatar
        alt="avatar"
        {...stringAvatar(
          `${singleUser?.data.user.name} ${singleUser?.data.user.surname}`
        )}
      />
    </Box>
  );
}
