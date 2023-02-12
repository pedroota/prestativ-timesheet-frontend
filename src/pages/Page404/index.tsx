import { Container } from "@mui/system";
import { Box, Typography } from "@mui/material";
import Logo from "assets/logo.png";
import { Link } from "react-router-dom";

export function Page404() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginBlock: "3rem",
        }}
      >
        <img
          src={Logo}
          alt="Logo Prestativ SAP com um circulo laranja em volta do P"
          width="300px"
        />
        <Typography variant="h5">
          Ops! Parece que a página que você está procurando não existe.
        </Typography>
        <Link to="/dashboard">Voltar para página inicial</Link>
      </Box>
    </Container>
  );
}
