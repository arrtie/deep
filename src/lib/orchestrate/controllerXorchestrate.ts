import { OrchestrateConfigProp, addToOrchestrate } from ".";
import { AudioController } from "./AudioController";
import { ToneController } from "./ToneController";

export function addAudioController(
  config: Omit<OrchestrateConfigProp, "controller">
) {
  addToOrchestrate({ ...config, controller: AudioController(config.src) });
}

export function addToneController(
  config: Omit<OrchestrateConfigProp, "controller">
) {
  addToOrchestrate({
    ...config,
    controller: ToneController({ defaultStop: 3 }),
  });
}
