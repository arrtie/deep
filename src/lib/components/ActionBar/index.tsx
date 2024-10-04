import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import usePlaybackStream from "../../Playback/usePlaybackStream";
import { theme } from "../../theme";
import { ActionBarButtons } from "./ActionBarButtons";
export const clearButtonColor = css({ backgroundColor: "black" });
export const ActionButton = emotionStyled.button({
  width: "fit-content",
  height: "2em",
  color: theme.colors.common.white,
});

export default function ActionBar() {
  const playback = usePlaybackStream();

  if (playback == null) {
    return <p>Action Bar Placeholder</p>;
  }

  return (
    <ActionBarButtons
      play={() => playback.play()}
      pause={() => playback.pause()}
      playing={false}
      disabled={false}
      reset={() => playback.destroy()}
    />
  );
}
