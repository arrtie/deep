import ActionBar from "../components/ActionBar";
import AudioPlayer from "../components/Player/Player";
import TimeView from "../components/Time";
import UserSelectionView from "../components/UserSelectionView";
import usePlaybackStream from "../Playback/usePlaybackStream";
import { Theme } from "../theme";

export default function Layout() {
  const playback = usePlaybackStream();

  return (
    <main
      css={(theme: Theme) => ({
        display: "grid",
        gridTemplateRows: "repeat(9)",
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
      <UserSelectionView />
      <TimeView playback={playback} />
      <ActionBar />
    </main>
  );
}
