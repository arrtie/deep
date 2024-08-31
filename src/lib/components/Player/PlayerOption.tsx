import { useCallback } from "preact/hooks";
import {
  SoundConfig,
  submitUserConfigOption,
} from "../../ConfigurationOptions";
import { SoundId } from "../../SoundManager";
import { Theme } from "../../theme";

export type OptionKind = "background" | "interval";

function makeSubmitHandler(id: SoundId, kind: OptionKind) {
  return function handleSubmit(e: Event) {
    e.preventDefault();
    const intervalInput: HTMLInputElement | null = (
      e.currentTarget as HTMLFormElement
    ).querySelector("input[name='interval']");
    if (intervalInput == null) {
      throw new Error("why no find interval input?");
    }
    const parsedInterval = parseInt(intervalInput.value);
    const soundConfig: SoundConfig = {
      id,
      delay: Number.isNaN(parsedInterval) ? 0 : parsedInterval,
      repetitions: 1,
    };
    console.log("submitting userConfigOption", kind);
    submitUserConfigOption(soundConfig, kind);
  };
}

export default function PlayerOption({
  presets: { kind, id },
  title,
}: {
  presets: { kind: OptionKind; id: SoundId; interval: number };
  title: string;
}) {
  const onHandleSubmit = useCallback(
    (e: Event) => makeSubmitHandler(id, kind)(e),
    [id, kind]
  );
  return (
    <form
      onSubmit={onHandleSubmit}
      css={(theme: Theme) => ({
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          kind === "background"
            ? theme.colors.main.primary
            : theme.colors.main.secondary,
        padding: "16px",
        boxShadow: "black 6px 6px",
        minWidth: "fit-content",
      })}
    >
      <h5>{title}</h5>
      <label css={{ display: kind === "background" ? "none" : "initial" }}>
        {`interval: `}
        {/* plays this sound on an interval; in minutes  */}
        <input type="number" name="interval" css={{ width: "2em" }} />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}
