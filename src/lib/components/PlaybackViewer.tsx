import { css } from "@emotion/react";
import emotionStyled from "@emotion/styled";
import { useEffect } from "preact/hooks";
import useUserSelectedConfigs from "../ConfigurationOptions/useUserSelectedConfigs";

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
  const options = useUserSelectedConfigs();
  const { bg, int } = options;
  console.log("playbackViewer: int", int, "bg", bg);
  useEffect(() => {
    console.log("every render");
  });

  return (
    <>
      <div css={row}>
        <SelectionHeader>BG:</SelectionHeader>
        {bg.map((option) => (
          <BackgroundSelection key={option.id}>
            {titleMap.get(option.id)}
          </BackgroundSelection>
        ))}
      </div>

      <div css={row}>
        <SelectionHeader>OPT:</SelectionHeader>
        {int.map((option) => (
          <OptionalSelection count={option.repetitions}>
            {titleMap.get(option.id)}
          </OptionalSelection>
        ))}
      </div>
    </>
  );
}
