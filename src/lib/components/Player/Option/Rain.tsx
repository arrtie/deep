import PlayerOption from "../PlayerOption";
const rainOptions = {
  interval: 0,
  background: true,
  src: "assets/rain.mp4",
};
export default function RainPlayerOption() {
  return <PlayerOption presets={rainOptions} title="Rain" />;
}
