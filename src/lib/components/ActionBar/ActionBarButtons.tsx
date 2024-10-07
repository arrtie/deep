import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { theme } from "../../theme";

export const clearButtonColor = css({ backgroundColor: "black" });
export const ActionButton = emotionStyled.button({
  padding: "8px",
  color: theme.colors.common.white,
});

interface ActionBarButtonsProps {
  play: () => void;
  pause: () => void;
  playing: boolean;
  disabled?: boolean;
  reset: () => void;
}

export function ActionBarButtons({
  play,
  pause,
  reset,
  playing,
  disabled,
}: ActionBarButtonsProps) {
  return (
    <section
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ActionButton
        css={clearButtonColor}
        type="button"
        onClick={() => reset()}
      >
        clear
      </ActionButton>
      <ActionButton
        disabled={disabled}
        css={clearButtonColor}
        type="button"
        onClick={() => (playing ? pause() : play())}
      >
        {playing ? "pause ||" : "play |>"}
      </ActionButton>
    </section>
  );
}
