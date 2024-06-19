import { CSSProperties } from "preact/compat";
import LittleBellPlayerOption from "./Option/LittleBell";
import RainPlayerOption from "./Option/Rain";
import WhitenoisePlayerOption from "./Option/Whitenoise";

const sectionStyles: string | CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "16px",
};

export default function AudioPlayer() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <section>
        <h5>Background Noises</h5>
        <div style={sectionStyles}>
          <RainPlayerOption />
          <WhitenoisePlayerOption />
        </div>
      </section>
      <section>
        <h5>Optional</h5>
        <LittleBellPlayerOption />
      </section>
    </div>
  );
}
