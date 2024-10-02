import {
  interval,
  map,
  merge,
  NEVER,
  Observable,
  scan,
  share,
  Subject,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { SoundConfig } from "../ConfigurationOptions";
import { Sound } from "../ConfigurationOptions/streams";
import { UserSelectionConfigs } from "../ConfigurationOptions/UserSelection";
import { SoundId } from "../soundOptons";
import { soundManager } from "../soundOptons/SoundManager";

function minToMs(time: number) {
  return time * 1000 * 60;
}

interface PlaybackProperties extends SoundConfig {
  repetitionsRemaining: number;
  offset: number;
  timeoutId: number | undefined;
  sound: Sound;
}

const stopwatchProps = {
  paused: true,
  current: 0,
  speed: 1000,
};
type State = typeof stopwatchProps;
export type StopwatchProps = State;

function makeStopwatch(subject: Observable<Partial<State>>) {
  return subject.pipe(
    scan(
      (acc: State, val: Partial<State>) => ({ ...acc, ...val }),
      stopwatchProps
    ),
    tap((val: State) => console.log("new vals: ", val)),
    switchMap((currentState: State) => {
      return currentState.paused
        ? NEVER
        : interval(currentState.speed).pipe(
            map((val: number) => {
              return {
                ...currentState,
                current: currentState.current + val * currentState.speed,
              };
            })
          );
    }),
    share()
  );
}

type StopwatchSubject = Subject<Partial<State>>;

function makeStopwatchController() {
  const playSubject: StopwatchSubject = new Subject();
  const pauseSubject: StopwatchSubject = new Subject();
  const resetSubject: StopwatchSubject = new Subject();
  const merged = merge(playSubject, pauseSubject, resetSubject);
  const stopwatch = makeStopwatch(merged);
  return {
    play: playSubject,
    pause: pauseSubject,
    reset: resetSubject,
    stopwatch,
  };
}

function newTimeout(intervals: Map<number, PlaybackProperties>, uuid: number) {
  const playbackProps = intervals.get(uuid);
  if (playbackProps == null) {
    throw new Error("why no playback props?");
  }
  const { offset, delay, repetitionsRemaining, sound } = playbackProps;
  const timeAmount = offset > 0 ? offset : minToMs(delay);
  const timeoutId = setTimeout(() => {
    sound.play();
    const newRepetitionsRemaining = repetitionsRemaining - 1;
    playbackProps.repetitionsRemaining = newRepetitionsRemaining;
    if (newRepetitionsRemaining > 0) {
      newTimeout(intervals, uuid);
    }
  }, timeAmount);

  playbackProps.timeoutId = timeoutId;
  playbackProps.offset = 0;
}

export class Playback {
  playStart: number = 0;
  playEnd: number = 0;
  bgs = new Map<SoundId, PlaybackProperties>();
  bgSounds: Sound[] = [];
  intervalSounds: Sound[] = [];
  intervalMap: Map<number, PlaybackProperties> = new Map();
  intervalsArray: PlaybackProperties[] = [];
  subscriptions: Subscription[] = [];
  //   timeSubject = new BehaviorSubject(stopwatchProps);
  //   timeStream = makeStopwatch(this.timeSubject);
  stopwatchStream: Observable<State>;
  stopwatchController: {
    play: StopwatchSubject;
    pause: StopwatchSubject;
    reset: StopwatchSubject;
  };

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
    const { play, pause, reset, stopwatch } = makeStopwatchController();
    this.stopwatchController = { play, pause, reset };
    this.stopwatchStream = stopwatch;
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
    this.stopwatchController.play.next({ paused: false });
  }

  pause() {
    console.log("pause");
    this.playEnd = performance.now();
    this.bgSounds.forEach((sound) => sound.pause());
    this.pauseIntevals();
    this.stopwatchController.pause.next({ paused: true });
  }

  destroy() {
    this.intervals.forEach(([, playbackProps]) => {
      const { timeoutId } = playbackProps;
      clearTimeout(timeoutId);
    });
    this.subscriptions.forEach((script) => {
      script.unsubscribe();
    });
  }

  subscribe(observer: { next: (val: State) => void }) {
    function makeUnSub(this: Playback): () => void {
      const sub = this.stopwatchStream.subscribe(observer);
      this.subscriptions.push(sub);
      return () => {
        const subIndex = this.subscriptions.findIndex((_sub) => _sub === sub);
        if (subIndex >= 0) {
          this.subscriptions.splice(subIndex, 1);
        }
      };
    }
    return makeUnSub.call(this);
  }
}
