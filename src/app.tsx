import { ThemeProvider } from "@emotion/react";
import { useEffect } from "preact/hooks";
import "./app.css";
import { subscribeToPlayStream } from "./lib/Controllers/streams";
import ActionBar from "./lib/components/ActionBar";
import PlaybackViewer from "./lib/components/PlaybackViewer";
import AudioPlayer from "./lib/components/Player/Player";
import { Theme, theme } from "./lib/theme";

export function App() {
  useEffect(() => {
    const subscription = subscribeToPlayStream();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main
        css={(theme: Theme) => ({
          display: "grid",
          gridTemplateRows: "repeat(8)",
          gridTemplateColumns: "auto",
          gap: "16px",
          padding: "16px",
          color: theme.colors.text.primary,
        })}
      >
        <h1 css={(theme: Theme) => ({ color: theme.colors.text.primary })}>
          DEEP
        </h1>
        <AudioPlayer />
        <PlaybackViewer />
        <ActionBar />
      </main>
    </ThemeProvider>
  );
}
