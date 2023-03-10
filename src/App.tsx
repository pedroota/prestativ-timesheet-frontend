import { Router } from "./routes/router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./sass/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "stores/themeStore";

function App() {
  const theme = useThemeStore((state) => state.theme);
  const lightTheme = createTheme();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme ? lightTheme : darkTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastContainer />
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
