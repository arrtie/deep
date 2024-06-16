import PlayerOption from "../PlayerOption";
const presets = { background: false, src: "assets/roar.mp4", interval: 0 };
export default function RoarPlayerOption() {
  return <PlayerOption presets={presets} title="Roar" />;
}
