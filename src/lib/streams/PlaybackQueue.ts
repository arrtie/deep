import { NextObserver } from "rxjs";
import { subscriptionWrapper } from "../../utils/subscriptionWrapper";
import ClearableStateStream from "../ClearableStateStream";
import { PlaybackBase } from "../orchestrate/orchestrate";

const { add, clear, stateStream } = ClearableStateStream<PlaybackBase>();

export function addPlaybackOptionToQueue(option: PlaybackBase) {
  add(option);
}

export function clearPlaybackQueue() {
  clear();
}

export default stateStream;

export function subscribeToPlaybackQueue(obs: NextObserver<PlaybackBase[]>) {
  return subscriptionWrapper(stateStream)(obs);
}
