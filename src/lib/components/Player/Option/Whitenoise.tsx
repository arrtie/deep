import PlayerOption from "../PlayerOption";
const rainOptions = {
  interval: 0,
  background: true,
  src: "assets/whitenoise.mp4",
};
export default function WhitenoisePlayerOption() {
  return <PlayerOption presets={rainOptions} title="Whitenoise" />;
}
