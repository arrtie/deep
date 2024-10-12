import { BehaviorSubject, Observable, share, tap } from "rxjs";
import { SoundConfig } from ".";
import { OptionKind } from "../components/Player/PlayerOption";

export interface UserSelectionConfigs {
  bgs: SoundConfig[];
  intervals: SoundConfig[];
}

interface UserSelectionI {
  bgs: SoundConfig[];
  intervals: SoundConfig[];
  subject: BehaviorSubject<UserSelectionConfigs | null>;
  stream: Observable<UserSelectionConfigs | null>;

  getConfigs: () => UserSelectionConfigs | null;

  emitConfigs: () => void;

  addConfig: (newConfig: SoundConfig, kind: OptionKind) => void;

  clearConfigs: () => void;
}

const userSelectionSubject = new BehaviorSubject<UserSelectionConfigs | null>(
  null
);

export const userSelection: UserSelectionI = {
  bgs: [],
  intervals: [],
  subject: userSelectionSubject,
  stream: userSelectionSubject.pipe(
    tap((value) => console.log("userselection: ", value)),
    share()
  ),

  getConfigs: () => {
    if (userSelection.bgs.length === 0 && userSelection.bgs.length === 0) {
      return null;
    }
    return { bgs: userSelection.bgs, intervals: userSelection.intervals };
  },

  emitConfigs: () => {
    userSelectionSubject.next(userSelection.getConfigs());
  },

  addConfig: (newConfig: SoundConfig, kind: OptionKind) => {
    if (kind === "background") {
      userSelection.bgs.push(newConfig);
    } else {
      userSelection.intervals.push(newConfig);
    }
    userSelection.emitConfigs();
  },

  clearConfigs: () => {
    userSelection.bgs = [];
    userSelection.intervals = [];
    userSelection.emitConfigs();
  },
};

export const userSelectionStream = userSelection.stream;
