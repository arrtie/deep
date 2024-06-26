import { useEffect, useMemo } from "preact/hooks";
import { PlaybackRef, makePlaybackRef } from "../../orchestrate/orchestrate";

import { addPlaybackRefs } from "../../orchestrate/playbackRefs";
import usePlaybackOptions from "../../soundOptons/usePlaybackOptions";
import { domAudioReady } from "../../streams/observables";
import Ardio from "../Ardio";

export default function ArdioGroup() {
  const userPlaybackOptions = usePlaybackOptions();
  const playbackRefs: PlaybackRef[] = useMemo(() => {
    const playbackRefs = userPlaybackOptions.map(makePlaybackRef);
    addPlaybackRefs(playbackRefs);
    return playbackRefs;
  }, [userPlaybackOptions]);

  // once Audio has rendered
  // call domAudioReady
  useEffect(() => {
    const justAudio: HTMLAudioElement[] = playbackRefs
      .map((config) => config.ref.current)
      .filter(
        (nodeOrNull): nodeOrNull is HTMLAudioElement => nodeOrNull !== null
      );
    domAudioReady(justAudio);
  }, [playbackRefs]);

  return (
    <aside style={{ display: "none" }}>
      {playbackRefs.map((config) => (
        <Ardio key={config.src} {...config} ref={config.ref} src={config.src} />
      ))}
    </aside>
  );
}
