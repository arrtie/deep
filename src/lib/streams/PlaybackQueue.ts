import { NextObserver, share } from "rxjs";
import { subscriptionWrapper } from "../../utils/subscriptionWrapper";
import ClearableStateStream from "../ClearableStateStream";
import { PlaybackBase } from "../orchestrate/orchestrate";

const { add, clear, stateStream } = ClearableStateStream<PlaybackBase>();
const sharedStateStream = stateStream.pipe(share());

export function addPlaybackOptionToQueue(option: PlaybackBase) {
  add(option);
}

export function clearPlaybackQueue() {
  clear();
}

export function subscribeToPlaybackQueue(obs: NextObserver<PlaybackBase[]>) {
  return subscriptionWrapper(sharedStateStream)(obs);
}

export default sharedStateStream;
