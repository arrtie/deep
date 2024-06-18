import { RefObject, createRef } from "preact";
import { AudioSourceNode, makeAudioSourceNode } from "../soundOptons/addAudio";
import { getPlaybackRefArray } from "./playbackRefs";

export type PlaybackSource = HTMLAudioElement | AudioSourceNode | string;

export type PlaybackPropety = "interval" | "loop";
export type PlaybackPropeties = {
  interval: number;
  loop: boolean;
};

// the big bad with all possible flags
export type PlaybackBase = PlaybackPropeties & {
  src: string;
};

export type PlaybackBasePartial = Partial<PlaybackPropeties> & { src: string };

// guaranteed a ref
export type PlaybackRef = PlaybackBase & {
  ref: RefObject<HTMLAudioElement>;
};
// guaranteed a sourceNode
export type PlaybackSourceNode = PlaybackBase & {
  sourceNode: AudioSourceNode;
};

export type Composer = ReturnType<typeof composeControls>;

type ControlConfig = PlaybackSourceNode & {
  intervalRemaining: number;
  intervalRef: undefined | number;
};

export const fakeController = {
  play() {
    console.log("fake play");
  },
  pause() {
    console.log("fake pause");
  },
};

function convertMinutesToSeconds(min: number) {
  return min * 60 * 1000;
}

const intervalConversion = convertMinutesToSeconds;

function composeControls(propConfigs: PlaybackSourceNode[]) {
  let timePlayed = 0;
  let playStart: undefined | number;
  let pauseStart: undefined | number;
  const intervals: ControlConfig[] = [];

  const configs = propConfigs.map((config) => {
    const thisControlConfig = {
      ...config,
      intervalRemaining: 0,
      intervalRef: undefined,
    };
    if (thisControlConfig.interval > 0) {
      intervals.push(thisControlConfig);
    }
    return thisControlConfig;
  });

  function play() {
    playStart = performance.now();
    configs.forEach((config: ControlConfig) => {
      if (config.interval > 0) {
        if (config.intervalRemaining > 0) {
          config.intervalRef = setTimeout(() => {
            config.sourceNode.play();
            config.intervalRemaining = 0;
            config.intervalRef = setInterval(() => {
              config.sourceNode.play();
            }, intervalConversion(config.interval));
          }, config.intervalRemaining);
          return;
        }
        config.intervalRef = setInterval(() => {
          config.sourceNode.play();
        }, intervalConversion(config.interval));
        return;
      }

      config.sourceNode.play();
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
      config.sourceNode.pause();
    });
  }

  return {
    play,
    pause,
  };
}

export function makePlaybackRef({
  src,
  interval = 0,
  loop = false,
}: PlaybackBase): PlaybackRef {
  const ref = createRef<HTMLAudioElement>();
  return {
    src,
    interval,
    loop,
    ref,
  };
}

export function makePlaybackBase({
  src,
  interval = 0,
  loop = false,
}: PlaybackBasePartial) {
  return {
    src,
    interval,
    loop,
  };
}

// Once you got a node
function matchAndMakePlaybackSourceNode(
  audio: HTMLAudioElement,
  audioCtx: AudioContext
): PlaybackSourceNode | null {
  const thisConfig = getPlaybackRefArray().find((pathConfig) =>
    audio.src.includes(pathConfig.src)
  );
  if (thisConfig == null) {
    return null;
  }
  return {
    ...thisConfig,
    sourceNode: makeAudioSourceNode(audio, audioCtx),
  };
}

// we have audio elements, let's append them to the audiocontext
export function nodesAreLoaded(
  audios: HTMLAudioElement[],
  audioCtx: AudioContext
) {
  const playbackSources = audios
    .map((audio) => matchAndMakePlaybackSourceNode(audio, audioCtx))
    .filter((source): source is PlaybackSourceNode => source != null);
  return composeControls(playbackSources);
}
