import { useState } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ConstructionIcon from "@mui/icons-material/Construction";
import CreateIcon from "@mui/icons-material/Create";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HailIcon from "@mui/icons-material/Hail";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HistoryIcon from "@mui/icons-material/History";
import WorkIcon from "@mui/icons-material/Work";
import ExitToApp from "@mui/icons-material/ExitToApp";
import PublicIcon from "@mui/icons-material/Public";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import { HeaderUser } from "components/HeaderUser";
import { Permission } from "components/Permission";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SidebarAndAppBarProps {
  children: JSX.Element;
}

export function SidebarAndAppBar({ children }: SidebarAndAppBarProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("prestativ-user");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" id="app-bar" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen((prevState) => !prevState)}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <img src={Logo} alt="Prestativ SAP Logo" width="200px" />
            <HeaderUser />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h6" noWrap component="div">
            Menu de Opções
          </Typography>
          <IconButton onClick={() => setOpen((prevState) => !prevState)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Permission roles={["TIMESHEET"]}>
          <List>
            <Link to="timesheet">
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"TimeSheet"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider />
        </Permission>
        <Permission
          roles={[
            "CADASTRO_CLIENTE" ||
              "CADASTRO_PROJETO" ||
              "CADASTRO_ATIVIDADE" ||
              "CADASTRO_USUARIO",
          ]}
        >
          <List>
            <Permission roles={["CADASTRO_CLIENTE"]}>
              <Link to="register-client">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Cadastrar Cliente"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["CADASTRO_PROJETO"]}>
              <Link to="register-project">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <ConstructionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Cadastrar Projeto"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["CADASTRO_ATIVIDADE"]}>
              <Link to="register-activity">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <CreateIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Cadastrar Atividade"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["CADASTRO_USUARIO"]}>
              <Link to="register-user">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Cadastrar Usuário"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
          </List>

          <Divider />
        </Permission>
        <Permission
          roles={[
            "VER_CLIENTES" ||
              "VER_PROJETOS" ||
              "VER_ATIVIDADES" ||
              "VER_USUARIOS" ||
              "VER_LOGS" ||
              "PERFIS_USUARIO" ||
              "CONFIGURACOES",
          ]}
        >
          <List>
            <Permission roles={["VER_CLIENTES"]}>
              <Link to="clients">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <PublicIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ver Clientes"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["VER_PROJETOS"]}>
              <Link to="projects">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ver Projetos"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["VER_ATIVIDADES"]}>
              <Link to="activities">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ver Atividades"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["VER_USUARIOS"]}>
              <Link to="users">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <HailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ver Usuários"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["VER_LOGS"]}>
              <Link to="logs">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ver Logs"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["PERFIS_USUARIO"]}>
              <Link to="profiles">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Perfis de Usuário"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
            <Permission roles={["CONFIGURACOES"]}>
              <Link to="settings">
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Configurações"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Permission>
          </List>
          <Divider />
        </Permission>
        <List>
          <ListItem onClick={logOut} disablePadding>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary={"Sair"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
