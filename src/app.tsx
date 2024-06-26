import { useEffect } from "preact/hooks";
import "./app.css";
import ActionBar from "./lib/components/ActionBar";
import ArdioGroup from "./lib/components/Ardio/ArdioGroup";
import PlaybackViewer from "./lib/components/PlaybackViewer";
import AudioPlayer from "./lib/components/Player/Player";
import { consentToPlayback } from "./lib/streams/observables";

export function App() {
  useEffect(() => {
    function consentHandler() {
      consentToPlayback();
      window.removeEventListener("click", consentHandler);
    }

    window.addEventListener("click", consentHandler);

    () => {
      window.addEventListener("click", consentHandler);
    };
  }, []);

  return (
    <>
      <main
        style={{
          display: "grid",
          gridTemplateRows: "repeat(8)",
          gridTemplateColumns: "auto",
          gap: "16px",
          padding: "16px",
        }}
      >
        <h1>DEEP</h1>
        <AudioPlayer />
        <PlaybackViewer />
        <ActionBar />
      </main>
      <ArdioGroup />
    </>
  );
}
