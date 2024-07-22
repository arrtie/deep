import { useCallback } from "preact/hooks";
import { OrchestrateConfigProp } from "../../orchestrate";
import {
  addAudioController,
  addToneController,
} from "../../orchestrate/controllerXorchestrate";
import { Theme } from "../../theme";

export type OptionKind = "background" | "interval";

function makeSubmitHandler(src: string, kind: OptionKind) {
  return function handleSubmit(e: Event) {
    e.preventDefault();
    const intervalInput: HTMLInputElement | null = (
      e.currentTarget as HTMLFormElement
    ).querySelector("input[name='interval']");
    if (intervalInput == null) {
      throw new Error("why no find interval input?");
    }
    const parsedInterval = parseInt(intervalInput.value);
    const controllerBase: Omit<OrchestrateConfigProp, "controller"> = {
      src,
      interval: Number.isNaN(parsedInterval) ? 0 : parsedInterval,
      repeat: 0,
    };
    // pass the config to AudioController()
    // add controller to configStream
    kind == "background"
      ? addAudioController(controllerBase)
      : addToneController(controllerBase);
  };
}

export default function PlayerOption({
  presets: { kind, src },
  title,
}: {
  presets: { kind: OptionKind; src: string; interval: number };
  title: string;
}) {
  const onHandleSubmit = useCallback(
    (e: Event) => makeSubmitHandler(src, kind)(e),
    [src, kind]
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
