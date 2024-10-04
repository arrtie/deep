import { Observable, Subscription } from "rxjs";
import { UserSelectionConfigs } from "../ConfigurationOptions/UserSelection";
import { SoundId } from "../soundOptons";
import { soundManager } from "../soundOptons/SoundManager";

import { Sound } from "../../types";
import {
  PlaybackProperties,
  StopwatchState,
  makeStopwatchController,
  minToMs,
  newTimeout,
} from "./utils";

export class Playback {
  playStart: number = 0;
  playEnd: number = 0;
  bgs = new Map<SoundId, PlaybackProperties>();
  bgSounds: Sound[] = [];
  intervalSounds: Sound[] = [];
  intervalMap: Map<number, PlaybackProperties> = new Map();
  intervalsArray: PlaybackProperties[] = [];
  subscriptions: Subscription[] = [];
  stopwatchStream: Observable<StopwatchState>;
  stopwatchController: {
    play: (now: number) => void;
    pause: (now: number) => void;
    destroy: () => void;
  };

  static count: number = 0;

  constructor(userSelections: UserSelectionConfigs) {
    this.bgSounds = userSelections.bgs.map((config) => {
      return soundManager.get(config.id);
    });
    userSelections.intervals.forEach((config, index) => {
      this.intervalMap.set(index, {
        ...config,
        offset: 0,
        repetitionsRemaining: config.repetitions,
        timeoutId: undefined,
        sound: soundManager.get(config.id),
      });
    });
    const { stopwatchStream, ...remaining } = makeStopwatchController();
    this.stopwatchController = remaining;
    this.stopwatchStream = stopwatchStream;
  }
  get intervals() {
    return Array.from(this.intervalMap.entries());
  }

  setUpIntervals() {
    this.intervals.forEach(([id, playbackProps]) => {
      const { repetitionsRemaining } = playbackProps;
      if (repetitionsRemaining === 0) {
        return;
      }
      newTimeout(this.intervalMap, id);
    });
  }

  pauseIntevals() {
    this.intervals.forEach(([, playbackProps]) => {
      const { sound, repetitionsRemaining, timeoutId, delay } = playbackProps;
      sound.pause();
      clearTimeout(timeoutId);
      if (repetitionsRemaining === 0) {
        return;
      }
      const delayInMin = minToMs(delay);
      const remainder = (this.playEnd - this.playStart) % delayInMin;
      playbackProps.offset = delayInMin * (1 - remainder);
    });
  }

  play() {
    console.log("play");
    this.playStart = performance.now();
    this.bgSounds.forEach((sound) => sound.play());
    this.setUpIntervals();
    this.stopwatchController.play(this.playStart);
  }

  pause() {
    console.log("pause");
    this.playEnd = performance.now();
    this.bgSounds.forEach((sound) => sound.pause());
    this.pauseIntevals();
    this.stopwatchController.pause(this.playEnd);
  }

  destroy() {
    this.pause();
    this.intervals.forEach(([, playbackProps]) => {
      const { timeoutId } = playbackProps;
      clearTimeout(timeoutId);
    });
    this.intervalMap.clear();
    this.stopwatchController.destroy();
  }
}
