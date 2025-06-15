import { createTheme } from "@mui/material";

// THEME SETUP
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a237e",
    },
    secondary: {
      main: "#f7c948",
    },
    background: {
      default: "#fdf9f3",
      paper: "#f6f3ea",
    },
    text: {
      primary: "#fff",
      secondary: "#7a6f53",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 700 },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#f7c948",
    },
    background: {
      default: "#18140b",
      paper: "#232014",
    },
    text: {
      primary: "#fff",
      secondary: "#b6a97a",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 700 },
  },
});
