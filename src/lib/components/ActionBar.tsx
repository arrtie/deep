import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useCallback, useState } from "preact/hooks";
import useUserSelectedConfigs from "../ConfigurationOptions/useUserSelectedConfigs";
import useActionBarController from "../Controllers/ActionBar";
import { theme } from "../theme";
const clearButtonColor = css({ backgroundColor: "black" });
const ActionButton = emotionStyled.button({
  width: "2em",
  height: "2em",
  color: theme.colors.common.white,
});

export default function ActionBar() {
  const userPlaybackOptions = useUserSelectedConfigs();
  const lC = useActionBarController();
  const [playState, setPlayState] = useState("querying");
  const hasOptions =
    userPlaybackOptions.bg.length > 0 || userPlaybackOptions.int.length > 0;

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
      {!hasOptions ? (
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
