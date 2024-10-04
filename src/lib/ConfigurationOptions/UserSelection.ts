import { BehaviorSubject, share } from "rxjs";
import { SoundConfig } from ".";
import { OptionKind } from "../components/Player/PlayerOption";

export interface UserSelectionConfigs {
  bgs: SoundConfig[];
  intervals: SoundConfig[];
}

export class UserSelection {
  static bgs: SoundConfig[] = [];
  static intervals: SoundConfig[] = [];
  static subject = new BehaviorSubject<UserSelectionConfigs | null>(null);
  static stream = UserSelection.subject.pipe(share());

  static getConfigs() {
    if (UserSelection.bgs.length === 0 && UserSelection.bgs.length === 0) {
      return null;
    }
    return { bgs: UserSelection.bgs, intervals: UserSelection.intervals };
  }

  static emitConfigs() {
    UserSelection.subject.next(UserSelection.getConfigs());
  }

  static addConfig(newConfig: SoundConfig, kind: OptionKind) {
    if (kind === "background") {
      UserSelection.bgs.push(newConfig);
    } else {
      UserSelection.intervals.push(newConfig);
    }
    UserSelection.emitConfigs();
  }

  static clearConfigs() {
    UserSelection.bgs = [];
    UserSelection.intervals = [];
    UserSelection.emitConfigs();
  }
}

export const userSelectionStream = UserSelection.stream;
