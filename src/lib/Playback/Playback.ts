import { SoundConfig } from "../ConfigurationOptions";
import { Sound } from "../ConfigurationOptions/streams";
import { UserSelectionConfigs } from "../ConfigurationOptions/UserSelection";
import { SoundId, soundManager } from "../soundOptons/SoundManager";

interface PlaybackProperties extends SoundConfig {
  repetitionsRemaining: number;
  offset: number;
  timeoutId: number | undefined;
  sound: Sound;
}

function newTimeout(
  intervals: Map<SoundId, PlaybackProperties>,
  soundId: SoundId
) {
  const playbackProps = intervals.get(soundId);
  if (playbackProps == null) {
    throw new Error("why no playback props?");
  }
  const { offset, delay, repetitionsRemaining, sound } = playbackProps;
  const timeAmount = offset > 0 ? offset : delay * 1000;
  const timeoutId = setTimeout(() => {
    sound.play();
    const newRepetitionsRemaining = repetitionsRemaining - 1;
    intervals.set(soundId, {
      ...playbackProps,
      repetitionsRemaining: newRepetitionsRemaining,
      timeoutId,
    });
    if (newRepetitionsRemaining > 0) {
      newTimeout(intervals, soundId);
    }
  }, timeAmount);
}

export class Playback {
  playStart: number = 0;
  playEnd: number = 0;
  bgs = new Map<SoundId, PlaybackProperties>();
  intervals = new Map<SoundId, PlaybackProperties>();
  bgSounds: Sound[] = [];
  intervalSounds: Sound[] = [];
  intervalMap: Map<SoundId, SoundConfig> = new Map();

  constructor(userSelections: UserSelectionConfigs) {
    this.bgSounds = userSelections.bgs.map((config) => {
      return soundManager.get(config.id);
    });
    userSelections.intervals.forEach((config) => {
      this.intervals.set(config.id, {
        ...config,
        offset: 0,
        repetitionsRemaining: config.repetitions,
        timeoutId: undefined,
        sound: soundManager.get(config.id),
      });
    });
  }
  setUpIntervals() {
    Array.from(this.intervals.entries()).forEach(([id, playbackProps]) => {
      const { repetitionsRemaining } = playbackProps;
      if (repetitionsRemaining === 0) {
        return;
      }
      newTimeout(this.intervals, id);
    });
  }

  pauseIntevals() {
    Array.from(this.intervals.entries()).forEach(([id, playbackProps]) => {
      const { sound, repetitionsRemaining } = playbackProps;
      sound.pause();
      if (repetitionsRemaining === 0) {
        return;
      }
      const currentInterval = this.intervals.get(id);
      if (currentInterval == null) {
        throw new Error("how?");
      }
      currentInterval.sound.pause();
      clearTimeout(currentInterval?.timeoutId);
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
}
