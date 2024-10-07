import { useCallback } from "preact/hooks";
import {
  SoundConfig,
  submitUserConfigOption,
} from "../../ConfigurationOptions";
import { SoundId } from "../../soundOptons";
import { Theme } from "../../theme";

export type OptionKind = "background" | "interval";

function makeSubmitHandler(id: SoundId, kind: OptionKind) {
  return function handleSubmit(e: Event) {
    e.preventDefault();
    const inputs: HTMLInputElement[] | null = Array.from(
      (e.currentTarget as HTMLFormElement).querySelectorAll("input")
    );
    if (inputs == null) {
      throw new Error("why no find interval input?");
    }

    const results: Map<string, number> = new Map(
      inputs.map((input) => {
        return [input.name, parseInt(input.value)];
      })
    );
    const delay = results.get("offset") ?? 0;
    const repetitions = results.get("repetitions") ?? 0;

    const soundConfig: SoundConfig = {
      id,
      delay,
      repetitions,
    };
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

      {kind === "background" ? null : (
        <>
          <label>
            {`offset: `}
            {/* plays this sound on an offset; in minutes  */}
            <input type="number" name="offset" css={{ width: "2em" }} />
          </label>
          <label>
            {`repetitions: `}
            {/* plays this sound on an repetitions; in minutes  */}
            <input type="number" name="repetitions" css={{ width: "2em" }} />
          </label>
        </>
      )}
      <button type="submit">Add</button>
    </form>
  );
}
