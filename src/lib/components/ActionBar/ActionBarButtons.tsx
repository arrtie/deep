import { ActionButton, clearButtonColor } from ".";

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
