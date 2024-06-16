import LittleBellPlayerOption from "./Option/LittleBell";
import RainPlayerOption from "./Option/Rain";
import RoarPlayerOption from "./Option/Roar";

export default function AudioPlayer() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >
      <RainPlayerOption />
      <RoarPlayerOption />
      <LittleBellPlayerOption />
    </div>
  );
}
