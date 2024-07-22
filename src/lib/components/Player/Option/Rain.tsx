import PlayerOption from "../PlayerOption";
const rainOptions = {
  kind: "background",
  background: true,
  src: "assets/rain.mp4",
};
export default function RainPlayerOption() {
  return <PlayerOption presets={rainOptions} title="Rain" />;
}
