import { map, scan, share } from "rxjs";
import { SoundConfig } from "../ConfigurationOptions";
import { Sound, bgConfigSubject } from "../ConfigurationOptions/streams";
import { soundManager } from "../SoundManager";

export const fakeController = {
  play() {
    console.log("fake play");
  },
  pause() {
    console.log("fake pause");
  },
} as const;

export type PlayPauseController = typeof fakeController;

export const bgControllerAccumulator = bgConfigSubject.pipe(
  map<SoundConfig, PlayPauseController>((bgConfig) => {
    return convertConfigToController(bgConfig);
  }),
  scan<PlayPauseController, PlayPauseController[]>(
    (acc, bgController): PlayPauseController[] => {
      acc.push(bgController);
      return acc;
    },
    []
  ),
  share()
);

export type ObserverLike<T, K = void> = {
  next: (value: T) => K;
};

function makeSoundPlayable(sound: Sound) {
  debugger;
  return {
    play() {
      debugger;
      sound.play();
    },
    pause() {
      sound.pause();
    },
  };
}

function convertConfigToController(config: SoundConfig): PlayPauseController {
  const sound = soundManager.get(config.id);
  return makeSoundPlayable(sound);
}

export function subscribeToPPControllerStream() {}
