import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useCallback, useEffect, useState } from "preact/hooks";
import useActionBarController from "../Controllers/useActionBarController";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";
import { theme } from "../theme";
const clearButtonColor = css({ backgroundColor: "black" });
const ActionButton = emotionStyled.button({
  width: "2em",
  height: "2em",
  color: theme.colors.common.white,
});

export default function ActionBar() {
  const userPlaybackOptions = usePlaybackOptions();
  const hasOptions = userPlaybackOptions != null;
  const lC = useActionBarController();
  const [playState, setPlayState] = useState("querying");

  useEffect(() => {
    const unSub = lC.subscribe({
      next: (val) => {
        console.log("current: ", val.current);
        console.log("paused: ", val.paused);
      },
    });
    return () => {
      unSub();
    };
  }, [lC]);

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
      {hasOptions &&
      (userPlaybackOptions.bgs.length > 0 ||
        userPlaybackOptions.intervals.length > 0) ? (
        <div />
      ) : (
        <ActionButton
          css={{
            display: hasOptions ? "inline-block" : "none",
            backgroundColor: "red",
          }}
          type="button"
          onClick={() => console.log("coming soon")}
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
