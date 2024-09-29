import { SoundConfig } from "../ConfigurationOptions";
import { Sound } from "../ConfigurationOptions/streams";
import { UserSelectionConfigs } from "../ConfigurationOptions/UserSelection";
import { SoundId } from "../soundOptons";
import { soundManager } from "../soundOptons/SoundManager";

function msToMin(time: number) {
  return time * 1000 * 60;
}

interface PlaybackProperties extends SoundConfig {
  repetitionsRemaining: number;
  offset: number;
  timeoutId: number | undefined;
  sound: Sound;
}

function newTimeout(intervals: Map<number, PlaybackProperties>, uuid: number) {
  const playbackProps = intervals.get(uuid);
  if (playbackProps == null) {
    throw new Error("why no playback props?");
  }
  const { offset, delay, repetitionsRemaining, sound } = playbackProps;
  const timeAmount = offset > 0 ? offset : msToMin(delay);
  const timeoutId = setTimeout(() => {
    sound.play();
    const newRepetitionsRemaining = repetitionsRemaining - 1;
    intervals.set(uuid, {
      ...playbackProps,
      repetitionsRemaining: newRepetitionsRemaining,
      timeoutId,
    });
    if (newRepetitionsRemaining > 0) {
      newTimeout(intervals, uuid);
    }
  }, timeAmount);
}

export class Playback {
  playStart: number = 0;
  playEnd: number = 0;
  bgs = new Map<SoundId, PlaybackProperties>();
  bgSounds: Sound[] = [];
  intervalSounds: Sound[] = [];
  intervalMap: Map<number, PlaybackProperties> = new Map();
  intervalsArray: PlaybackProperties[] = [];

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
    this.intervals.forEach(([id, playbackProps]) => {
      const { sound, repetitionsRemaining } = playbackProps;
      sound.pause();
      if (repetitionsRemaining === 0) {
        return;
      }
      const currentInterval = this.intervalMap.get(id);
      if (currentInterval == null) {
        throw new Error("how?");
      }
      currentInterval.sound.pause();
      clearTimeout(currentInterval.timeoutId);
      currentInterval.offset = this.playEnd - this.playStart;
    });
  }

  play() {
    console.log("play");
    this.playStart = performance.now();
    this.bgSounds.forEach((sound) => sound.play());
    this.setUpIntervals();
  }

  pause() {
    console.log("pause");
    this.playEnd = performance.now();
    this.bgSounds.forEach((sound) => sound.pause());
    this.pauseIntevals();
  }

  destroy() {
    this.intervals.forEach(([, playbackProps]) => {
      const { timeoutId } = playbackProps;
      clearTimeout(timeoutId);
    });
  }
}
