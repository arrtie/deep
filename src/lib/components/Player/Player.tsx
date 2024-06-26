import { CSSProperties } from "preact/compat";
import LittleBellPlayerOption from "./Option/LittleBell";
import RainPlayerOption from "./Option/Rain";
import WhitenoisePlayerOption from "./Option/Whitenoise";

const sectionStyles: string | CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: "16px",
};

export default function AudioPlayer() {
  return (
    <>
      <h5>Background Noises</h5>
      <div style={sectionStyles}>
        <RainPlayerOption />
        <WhitenoisePlayerOption />
      </div>
      <h5>Options</h5>
      <div style={sectionStyles}>
        <LittleBellPlayerOption />
      </div>
    </>
  );
}
