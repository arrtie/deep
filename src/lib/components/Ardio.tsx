import { Ref } from "preact";
import { forwardRef } from "preact/compat";
import { PlaybackPath } from "../orchestrate";

const Ardio = forwardRef(
  ({ src, loop }: PlaybackPath, ref: Ref<HTMLAudioElement>) => {
    return <audio src={src} loop={loop} ref={ref} controls />;
  }
);

export default Ardio;
