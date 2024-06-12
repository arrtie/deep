import { Ref } from "preact";
import { forwardRef } from "preact/compat";
import { PlaybackRef } from "../orchestrate";

const Ardio = forwardRef(
  ({ src, loop }: PlaybackRef, ref: Ref<HTMLAudioElement>) => {
    return <audio src={src} loop={loop} ref={ref} controls />;
  }
);

export default Ardio;
