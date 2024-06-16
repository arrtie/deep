import { RefObject, createRef } from "preact";
import { NextObserver, Subject, scan } from "rxjs";
import { subscriptionWrapper } from "../utils/subscriptionWrapper";
import { AudioSourceNode, makeAudioSourceNode } from "./soundOptons/addAudio";

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
            }, config.interval * 1000);
          }, config.intervalRemaining);
          return;
        }
        config.intervalRef = setInterval(() => {
          config.sourceNode.play();
        }, config.interval * 1000);
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
        config.intervalRemaining = timePlayed % (config.interval * 1000);
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

const playbackRefMap = new Map<string, PlaybackRef>();

export function getPlaybackRefArray() {
  return Array.from(playbackRefMap.entries()).map(([, val]) => val);
}

export function addPlaybackRef(ref: PlaybackRef) {
  playbackRefMap.set(ref.src, ref);
}

export function addPlaybackRefs(refs: PlaybackRef[]) {
  playbackRefMap.clear();
  refs.forEach((ref) => addPlaybackRef(ref));
}

export function addPlaybackOptionToQueue(option: PlaybackBase) {
  playbackQueueSubject.next(option);
}

const playbackQueueSubject = new Subject<PlaybackBase>();
export function addPlaybackToQueue(base: PlaybackBase) {
  playbackQueueSubject.next(base);
}

const playbackQueueStream = playbackQueueSubject.pipe(
  scan((acc: PlaybackBase[], option: PlaybackBase) => {
    acc.push(option);
    return acc;
  }, [])
);

export function subscribeToPlaybackQueue(obs: NextObserver<PlaybackBase[]>) {
  return subscriptionWrapper(playbackQueueStream)(obs);
}
