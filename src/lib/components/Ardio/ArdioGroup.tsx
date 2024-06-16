import { useEffect, useMemo } from "preact/hooks";
import {
  PlaybackBase,
  PlaybackRef,
  addPlaybackRefs,
  makePlaybackRef,
} from "../../orchestrate";

import { domAudioReady } from "../../soundOptons/observables";
import Ardio from "../Ardio";

export default function ArdioGroup({
  playbackBases,
}: {
  playbackBases: PlaybackBase[];
}) {
  const playbackRefs: PlaybackRef[] = useMemo(() => {
    const playbackRefs = playbackBases.map(makePlaybackRef);
    addPlaybackRefs(playbackRefs);
    return playbackRefs;
  }, [playbackBases]);

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
    <>
      {playbackRefs.map((config) => (
        <Ardio key={config.src} {...config} ref={config.ref} src={config.src} />
      ))}
    </>
  );
}
