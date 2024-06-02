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

function composeControls(configs: PlaybackImage[]) {
  let intervals: (number | undefined)[] = [];

  function play() {
    console.trace("ComposeControl play");
    if (intervals.length > 0) {
      intervals.forEach((interval) => {
        clearInterval(interval);
      });
    }

    intervals = configs.map(({ interval, src }) => {
      // Sound with a non-zero interval
      if (interval > 0) {
        return setInterval(() => {
          src.play();
        }, interval);
      }
      // Sounds without interval are immiadtely played
      src.play();
      return undefined;
    });
  }
  return {
    play,
    pause: () => null,
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
