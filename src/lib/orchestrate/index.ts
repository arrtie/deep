import { Observer, map } from "rxjs";
import { orchestrateConfigPropStream } from "./stream";
import { BaseController } from "./types";

export const ArdioContext = {
  audioContext: new AudioContext(),
};

export function addToOrchestrate(config: OrchestrateConfigProp) {
  orchestrateConfigPropStream.add(config);
}

export function clearOrchestrate() {
  orchestrateConfigPropStream.clear();
}

export function subscribeToOrchConfigStream(
  obs: Observer<OrchestrateConfigProp[]>
) {
  return orchestrateConfigPropStream.subscribe(obs);
}

function getOrchestrateConfigPropStream() {
  return orchestrateConfigPropStream.stateStream;
}

function convertMinutesToSeconds(min: number) {
  return min * 60 * 1000;
}

const intervalConversion = convertMinutesToSeconds;

export type OrchestrateConfigProp = {
  src: string;
  controller: BaseController;
  interval?: number;
  repeat?: number;
};

type OrchestrateConfig = {
  src: string;
  controller: BaseController;
  interval: number;
  intervalRemaining: number;
  repeat: number;
  repetitionsRemaining: number;
  intervalRef: number | undefined;
};

function makeOrchestrateConfig(prop: OrchestrateConfigProp): OrchestrateConfig {
  return {
    ...prop,
    interval: prop.interval ?? 0,
    repeat: prop.repeat ?? 0,
    intervalRemaining: 0,
    repetitionsRemaining: prop.repeat ?? 0,
    intervalRef: undefined,
  };
}

export function composeControls(propConfigs: OrchestrateConfigProp[]) {
  let timePlayed = 0;
  let playStart: undefined | number;
  let pauseStart: undefined | number;
  const configs: OrchestrateConfig[] = propConfigs.map(makeOrchestrateConfig);

  function play() {
    playStart = performance.now();
    configs.forEach((config: OrchestrateConfig) => {
      if (config.interval > 0) {
        if (config.intervalRemaining > 0) {
          config.intervalRef = setTimeout(() => {
            config.controller.play();
            config.intervalRemaining = 0;
            config.intervalRef = setInterval(() => {
              config.controller.play();
            }, intervalConversion(config.interval));
          }, config.intervalRemaining);
          return;
        }
        config.intervalRef = setInterval(() => {
          config.controller.play();
        }, intervalConversion(config.interval));
        return;
      }

      config.controller.play();
    });
  }

  function pause() {
    pauseStart = performance.now();
    timePlayed = timePlayed + (pauseStart - (playStart ?? pauseStart)); // no guarantee pause was called first
    configs.forEach((config) => {
      if (config.interval > 0) {
        clearInterval(config.intervalRef);
        config.intervalRemaining =
          timePlayed % intervalConversion(config.interval);
      }
      config.controller.pause();
    });
  }

  return {
    play,
    pause,
  };
}

export default function Orchestrate() {
  const composerStream = getOrchestrateConfigPropStream().pipe(
    map(composeControls)
  );
  return composerStream;
}

export const composerStream = Orchestrate();

// add new sound's config to array
// clear old conrol references
// compose new controls
// emit Composer;
