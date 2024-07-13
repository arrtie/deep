import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useCallback, useState } from "preact/hooks";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";
import { clearPlaybackQueue } from "../streams/PlaybackQueue";
import { theme } from "../theme";
import useController from "./Controller/useController";
const clearButtonColor = css({ backgroundColor: "black" });
const ActionButton = emotionStyled.button({
  width: "2em",
  height: "2em",
  color: theme.colors.common.white,
});

export default function ActionBar() {
  const userPlaybackOptions = usePlaybackOptions();
  const hasOptions = userPlaybackOptions.length > 0;
  const lC = useController();
  const [playState, setPlayState] = useState("querying");

  const play = useCallback(() => {
    lC.play();
    setPlayState("playing");
  }, [lC]);

  const pause = useCallback(() => {
    lC.pause();
    setPlayState("paused");
  }, [lC]);

  return (
    <section
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {userPlaybackOptions.length === 0 ? (
        <div />
      ) : (
        <ActionButton
          css={{
            display: hasOptions ? "inline-block" : "none",
            backgroundColor: "red",
          }}
          type="button"
          onClick={() => clearPlaybackQueue()}
        >
          X
        </ActionButton>
      )}
      <ActionButton
        disabled={hasOptions === false}
        css={clearButtonColor}
        type="button"
        onClick={() => (playState === "playing" ? pause() : play())}
      >
        {playState === "playing" ? "||" : "|>"}
      </ActionButton>
    </section>
  );
}
