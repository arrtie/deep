import { Playbacksrc } from "../../orchestrate";
import usePlaybackRefs from "../../orchestrate/usePlaybackRefs";

import Ardio from "../Ardio";

export default function ArdioGroup({
  playbacksrcs,
}: {
  playbacksrcs: Playbacksrc[];
}) {
  const playbackRefs = usePlaybackRefs(playbacksrcs);

  return (
    <>
      {playbackRefs.map((config) => (
        <Ardio key={config.src} {...config} ref={config.ref} src={config.src} />
      ))}
    </>
  );
}
