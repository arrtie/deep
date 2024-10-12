export function TimeView({ timeInMs }: { timeInMs: number }) {
  const elapsedMinutes = Math.floor(timeInMs / 1000 / 60);
  const displayMinutes =
    elapsedMinutes >= 10 ? elapsedMinutes : `0${elapsedMinutes}`;
  const elapsedSeconds = ((timeInMs / 1000) % 60).toPrecision(3);
  const displaySeconds =
    parseFloat(elapsedSeconds) >= 10 ? elapsedSeconds : `0${elapsedSeconds}`;
  return (
    <div css={{ display: "flex", justifyContent: "start" }}>
      Elapsed time: {displayMinutes}:{displaySeconds}
    </div>
  );
}
