import useSubscribe from "../../utils/useSubscribe";
import { playbackStream } from "./PlaybackStream";

// returns a controller on each composerStream emission ( your audio elements are loaded!)
export default function usePlaybackStream() {
  return useSubscribe(playbackStream);
}
