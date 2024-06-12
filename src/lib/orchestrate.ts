import { RefObject, createRef } from "preact";
import { BehaviorSubject } from "rxjs";
import { AudioSourceNode } from "./soundOptons/addAudio";

export type PlaybackSource = HTMLAudioElement | AudioSourceNode | string;

export type PlaybackPropeties = {
  interval: number;
  loop: boolean;
  repeat: boolean;
};

// the big bad with all possible flags
export type PlaybackBase = PlaybackPropeties & {
  src: string;
};

export type PlaybackBasePartial = Partial<PlaybackPropeties> & { src: string };

// all props are wild!
export type PlaybackPartial = Partial<PlaybackBase>;
// guaranteed the audio's path for the src attribute
export type Playbacksrc = PlaybackBase;
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
    console.trace("ComposeControl play");
    playStart = performance.now();

    configs.forEach((config: ControlConfig) => {
      if (config.interval > 0) {
        if (config.intervalRemaining > 0) {
          console.log("intervalRemaining: ", config.intervalRemaining);
          config.intervalRef = setTimeout(() => {
            config.sourceNode.play();
            config.intervalRemaining = 0;
            config.intervalRef = setInterval(() => {
              config.sourceNode.play();
            }, config.interval);
          }, config.intervalRemaining);
          return;
        }
        config.intervalRef = setInterval(() => {
          config.sourceNode.play();
        }, config.interval);
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
        config.intervalRemaining = timePlayed % config.interval;
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
  repeat = false,
}: PlaybackPartial & { src: string }): PlaybackRef {
  const ref = createRef<HTMLAudioElement>();
  return {
    src,
    interval,
    loop,
    repeat,
    ref,
  };
}

export function makePlaybackBase({
  src,
  interval = 0,
  loop = false,
  repeat = false,
}: PlaybackBasePartial) {
  return {
    src,
    interval,
    loop,
    repeat,
  };
}

export function makePlaybackSourceNode() {}

const playbacksrcArray: Playbacksrc[] = [];

export const playbackSubject = new BehaviorSubject<Playbacksrc[]>(
  playbacksrcArray
);

export function addPlaybacksrc(pbsrc: Playbacksrc) {
  playbacksrcArray.push(pbsrc);
  playbackSubject.next(playbacksrcArray);
}

export function getPlaybacksrcs() {
  return playbacksrcArray;
}

// Once you got a node
function matchAndMakePlaybackSourceNode(
  audio: HTMLAudioElement,
  audioCtx: AudioContext
): PlaybackSourceNode | null {
  const thisConfig = playbacksrcArray.find((pathConfig) =>
    audio.src.includes(pathConfig.src)
  );
  if (thisConfig == null) {
    return null;
  }
  return {
    ...thisConfig,
    sourceNode: new AudioSourceNode(audio, audioCtx),
  };
}

export function nodesAreLoaded(
  audios: HTMLAudioElement[],
  audioCtx: AudioContext
) {
  const playbackSources = audios
    .map((audio) => matchAndMakePlaybackSourceNode(audio, audioCtx))
    .filter((source): source is PlaybackSourceNode => source != null);
  return composeControls(playbackSources);
}

const playbackRefMap = new Map<string, PlaybackRef>();

export function getPlaybackRefArray() {
  return Array.from(playbackRefMap.entries()).map(([, val]) => val);
}

export function addPlaybackRef(ref: PlaybackRef) {
  playbackRefMap.set(ref.src, ref);
}

export function addPlaybackRefs(refs: PlaybackRef[]) {
  refs.forEach((ref) => addPlaybackRef(ref));
}
