import PlayerOption from "../PlayerOptionForm";
const rainOptions = {
  kind: "background",
  background: true,
  id: "whitenoise",
};
export default function WhitenoisePlayerOption() {
  return <PlayerOption presets={rainOptions} title="Whitenoise" />;
}
