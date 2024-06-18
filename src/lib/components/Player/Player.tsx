import LittleBellPlayerOption from "./Option/LittleBell";
import RainPlayerOption from "./Option/Rain";
import WhitenoisePlayerOption from "./Option/Whitenoise";

export default function AudioPlayer() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "1fr 1fr / 1fr 1fr",
        gap: "16px",
      }}
    >
      <div>
        <RainPlayerOption />
        <WhitenoisePlayerOption />
      </div>
      <div>
        <LittleBellPlayerOption />
      </div>
    </div>
  );
}
