import { ThemeProvider } from "@emotion/react";
import { useEffect } from "preact/hooks";
import "./app.css";
import ActionBar from "./lib/components/ActionBar";
import ArdioGroup from "./lib/components/Ardio/ArdioGroup";
import PlaybackViewer from "./lib/components/PlaybackViewer";
import AudioPlayer from "./lib/components/Player/Player";
import { AudioController } from "./lib/orchestrate/AudioController";
import { consentToPlayback } from "./lib/streams/observables";
import { Theme, theme } from "./lib/theme";

export function App() {
  useEffect(() => {
    function consentHandler() {
      consentToPlayback();
      window.removeEventListener("click", consentHandler);
      const myAudio = AudioController("assets/rain.mp4");
      setTimeout(() => {
        console.log("myAudio.isInitialized: ", myAudio.isInitialized);
        myAudio.play(0, 5);
      }, 5000);
    }

    window.addEventListener("click", consentHandler);

    () => {
      window.addEventListener("click", consentHandler);
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
      <ArdioGroup />
    </ThemeProvider>
  );
}
