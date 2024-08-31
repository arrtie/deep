import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useMemo } from "preact/hooks";
import { IntervalOnly, LoopOnly, SoundConfig } from "../ConfigurationOptions";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";

const titleMap = new Map([
  ["assets/whitenoise.mp4", "Whitenoise"],
  ["assets/little-bell.wav", "Bell"],
  ["assets/rain.mp4", "Rain"],
  ["whitenoise", "Whitenoise"],
  ["bell", "Bell"],
  ["rain", "Rain"],
]);

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

// const OptionalSelection = {
//   backgroundColor: "blue",
//   position: "relative",
//   "&:after": {
//     content: '"x"',
//     minWidth: "1em",
//     height: "1em",
//     backgroundColor: "red",
//     position: "absolute",
//     top: 0,
//     right: 0,
//   },
// };

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

export default function PlaybackViewer() {
  const userPlaybackOptions = usePlaybackOptions();
  const [bg, opt] = useMemo(() => {
    const _bg: LoopOnly[] = [];
    const _opt: IntervalOnly[] = [];
    userPlaybackOptions.forEach((option: SoundConfig) => {
      if ("delay" in option) {
        _opt.push(option);
        return;
      }
      if ("loop" in option) {
        _bg.push(option);
        return;
      }
    });
    return [_bg, _opt];
  }, [userPlaybackOptions]);
  console.log("opt", opt, "bg", bg);

  return (
    <>
      <div css={row}>
        <SelectionHeader>BG:</SelectionHeader>
        {bg.map((option) => (
          <BackgroundSelection>{titleMap.get(option.id)}</BackgroundSelection>
        ))}
      </div>

      <div css={row}>
        <SelectionHeader>OPT:</SelectionHeader>
        {opt.map((option) => (
          <OptionalSelection count={option.repetitions}>
            {titleMap.get(option.id)}
          </OptionalSelection>
        ))}
      </div>
    </>
  );
}
