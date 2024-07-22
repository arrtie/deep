import PlayerOption from "../PlayerOption";
const rainOptions = {
  kind: "background",
  background: true,
  src: "assets/whitenoise.mp4",
};
export default function WhitenoisePlayerOption() {
  return <PlayerOption presets={rainOptions} title="Whitenoise" />;
}
