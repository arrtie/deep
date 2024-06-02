import { RefObject, createRef } from "preact";
import { AudioSourceNode } from "./soundOptons/addAudio";

export type PlaybackSource = HTMLAudioElement | AudioSourceNode | string;

export type PlaybackBase<T = PlaybackSource> = {
  src: T;
  interval: number;
  loop: boolean;
  repeat: boolean;
  ref: RefObject<HTMLAudioElement>;
};

export type PlaybackPartial<T> = Partial<PlaybackBase<T>> & { src: T };

export type PlaybackConfig = PlaybackBase<HTMLAudioElement>;

export type PlaybackImage = PlaybackBase<AudioSourceNode>;

export type PlaybackPath = PlaybackBase<string>;

export type Composer = ReturnType<typeof composeControls>;

type ControlConfig = PlaybackImage & {
  intervalRemaining: number;
  intervalRef: undefined | number;
};
function composeControls(propConfigs: PlaybackImage[]) {
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
    console.trace("ComposeControl play");
    playStart = performance.now();

    configs.forEach((config: ControlConfig) => {
      if (config.interval > 0) {
        if (config.intervalRemaining > 0) {
          console.log("intervalRemaining: ", config.intervalRemaining);
          config.intervalRef = setTimeout(() => {
            config.src.play();
            config.intervalRemaining = 0;
            config.intervalRef = setInterval(() => {
              config.src.play();
            }, config.interval);
          }, config.intervalRemaining);
          return;
        }
        debugger;
        config.intervalRef = setInterval(() => {
          config.src.play();
        }, config.interval);
        return;
      }
      config.src.play();
    });
  }
  function pause() {
    pauseStart = performance.now();
    timePlayed = timePlayed + (pauseStart - (playStart ?? pauseStart)); // no guarantee pause was called first
    configs.forEach((config) => {
      if (config.interval > 0) {
        clearInterval(config.intervalRef);
        config.intervalRemaining = timePlayed % config.interval;
      }
      config.src.pause();
    });
  }

  return {
    play,
    pause,
  };
}

export function makeConfig<T>({
  src,
  interval = 0,
  loop = false,
  repeat = false,
}: PlaybackPartial<T>): PlaybackBase<T> {
  const ref = createRef<HTMLAudioElement>();
  return {
    src,
    interval,
    loop,
    repeat,
    ref,
  };
}

const playbackPathArray: PlaybackPath[] = [];

export function addPlaybackPath(playbackPath: PlaybackPath) {
  playbackPathArray.push(playbackPath);
}

export function getPlaybackPaths() {
  return playbackPathArray;
}

// Once you got a node
function matchAndMakePlaybackImage(
  audio: HTMLAudioElement,
  audioCtx: AudioContext
): PlaybackImage {
  const thisConfig = playbackPathArray.find((pathConfig) =>
    audio.src.includes(pathConfig.src)
  )!;
  return makeConfig({
    ...thisConfig,
    src: new AudioSourceNode(audio, audioCtx),
  });
}

export function nodesAreLoaded(
  audios: HTMLAudioElement[],
  audioCtx: AudioContext
) {
  const playbackImages = audios.map((audio) =>
    matchAndMakePlaybackImage(audio, audioCtx)
  );
  return composeControls(playbackImages);
}
