import { useCallback } from "preact/hooks";
import { OptionKind } from "../../../types";

import { SoundId } from "../../SoundManager";
import { Theme } from "../../theme";
import {
  UserOptionFormEvent,
  makeUserOptionSubmitHandler,
} from "./submitPlayerOption";

export default function PlayerOption({
  presets: { kind, id },
  title,
}: {
  presets: { kind: OptionKind; id: SoundId; interval: number };
  title: string;
}) {
  const onHandleSubmit = useCallback(
    (e: UserOptionFormEvent) => makeUserOptionSubmitHandler(id, kind)(e),
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
        alignItems: "stretch",
      })}
    >
      <h2>{title}</h2>
      <label css={{ display: kind === "background" ? "none" : "initial" }}>
        {`interval length: `}
        {/* plays this sound on an interval; in minutes  */}
        <input type="number" name="interval" css={{ width: "4em" }} />
      </label>
      <label css={{ display: kind === "background" ? "none" : "initial" }}>
        {`number of repetitions: `}
        {/* plays this sound on an interval; in minutes  */}
        <input type="number" name="repetitions" css={{ width: "4em" }} />
      </label>
      <label css={{ display: kind === "background" ? "none" : "initial" }}>
        {`initial delay: `}
        {/* plays this sound on an interval; in minutes  */}
        <input type="number" name="delay" css={{ width: "4em" }} />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}
