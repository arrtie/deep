import { ThemeProvider } from "@emotion/react";
import "./app.css";
import Layout from "./lib/Layout";
import "./lib/Playback/utils";
import { theme } from "./lib/theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}
