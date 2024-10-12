import IntervalOptions from "./IntervalOptions";
import RainPlayerOption from "./Option/Rain";
import WhitenoisePlayerOption from "./Option/Whitenoise";

const sectionStyles = {
  display: "flex",
  justifyContent: "flex-start",
  "& form": {
    marginRight: "16px",
    "&:last-of-type": {
      marginRight: "unset",
    },
  },
};

export default function AudioPlayer() {
  return (
    <>
      <h5>Background Noises</h5>
      <div css={sectionStyles}>
        <RainPlayerOption />
        <WhitenoisePlayerOption />
      </div>
      <h5>Options</h5>
      <div css={sectionStyles}>
        <IntervalOptions />
      </div>
    </>
  );
}
