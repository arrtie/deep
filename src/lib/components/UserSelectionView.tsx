import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useMemo } from "preact/hooks";
import { SoundConfig } from "../ConfigurationOptions";
import { getSoundTitle } from "../soundOptons";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";

const selectionStyle = css`
  width: fit-content;
  border-radius: 4px;
  padding: 8px;
  margin: 4px;
`;

const selectionHeaderStyle = css([
  selectionStyle,
  { border: "solid 1px white" },
]);
const SelectionHeader = emotionStyled.h5(selectionHeaderStyle);
const backgroundSelectionStyle = css([
  selectionStyle,
  { backgroundColor: "hotpink" },
]);

const row = css({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
});

const centerStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const BackgroundSelection = emotionStyled.p(backgroundSelectionStyle);
const OptionalSelection = emotionStyled.p(
  [
    selectionStyle,
    {
      backgroundColor: "purple",
      position: "relative",
      "&:after": css([
        {
          minWidth: "1em",
          padding: "8px",
          borderRadius: "1em",
          height: "1em",
          backgroundColor: "red",
          position: "absolute",
          top: "-1em",
          right: "-1em",
        },
        centerStyle,
      ]),
    },
  ],
  (props) => ({ "&:after": { content: `"x${props.count ?? 1}"` } })
);

export default function UserSelectionView() {
  const userPlaybackOptions = usePlaybackOptions();
  const [bg, opt] = useMemo(() => {
    let _bg: SoundConfig[] = [];
    let _opt: SoundConfig[] = [];
    if (userPlaybackOptions != null) {
      _bg = userPlaybackOptions.bgs.map((option: SoundConfig) => option);
      _opt = userPlaybackOptions.intervals.map((option: SoundConfig) => option);
    }
    return [_bg, _opt];
  }, [userPlaybackOptions]);

  return (
    <>
      <div css={row}>
        <SelectionHeader>BG:</SelectionHeader>
        {bg.map((option) => (
          <BackgroundSelection>{getSoundTitle(option.id)}</BackgroundSelection>
        ))}
      </div>

      <div css={row}>
        <SelectionHeader>OPT:</SelectionHeader>
        {opt.map((option) => (
          <OptionalSelection count={option.repetitions}>
            <span css={{ display: "block", fontWeight: 500 }}>
              {getSoundTitle(option.id)}
            </span>
            <span>delay: {option.delay} mins.</span>
          </OptionalSelection>
        ))}
      </div>
    </>
  );
}
