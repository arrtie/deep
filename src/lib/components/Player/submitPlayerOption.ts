import { OptionKind, SoundConfig } from "../../../types";
import { submitUserConfigOption } from "../../ConfigurationOptions";
import { SoundId } from "../../SoundManager";

export type UserOptionFormEvent = SubmitEvent;

function formatFormInputs(form: HTMLFormElement): Omit<SoundConfig, "id"> {
  const formData = new FormData(form);
  const interval = parseInt(formData.get("interval") as string) ?? 0;
  const delay = parseInt(formData.get("delay") as string) ?? 0;
  const repetitions = parseInt(formData.get("repetitions") as string) ?? 0;

  const returnable = { interval, delay, repetitions };
  return returnable;
}

export function makeUserOptionSubmitHandler(id: SoundId, kind: OptionKind) {
  return function handleSubmit(e: UserOptionFormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("why no find formElement?");
    }

    const soundConfig: SoundConfig = {
      id,
      ...formatFormInputs(form),
    };
    submitUserConfigOption(soundConfig, kind);
  };
}
