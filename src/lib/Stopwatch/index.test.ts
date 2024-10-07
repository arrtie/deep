import { Subscription } from "rxjs";
import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";
import { makeStopwatchController, StopwatchState } from ".";
type LoggerType<T> = {
  logs: T[];
  clear: () => void;
  push: (val: T) => void;
};
const logger: LoggerType<StopwatchState | null> = {
  logs: [],
  clear: () => (logger.logs = []),
  push: (val) => logger.logs.push(val),
};

let sub: Subscription | null = null;

function setup() {
  const swcont = makeStopwatchController();
  sub = swcont.stopwatchStream.subscribe({
    next: (state: StopwatchState | null) => {
      logger.push(state);
    },
  });
  return { ...swcont };
}

beforeEach(() => {
  vitest.useFakeTimers();
});

afterEach(() => {
  vitest.useRealTimers();
  logger.clear();
  if (sub) {
    sub.unsubscribe();
  }
});

describe("when pause is called first", () => {
  it("should start with a delta of 0 and remain stopped", async () => {
    const swcont = setup();
    swcont.pause();
    expect(logger.logs[0]).toMatchObject({
      delta: 0,
      startTime: null,
      state: "stopped",
    });
  });
});

describe("when play is called", () => {
  it("should start with a delta of 0", async () => {
    const swcont = setup();
    swcont.play();
    expect(logger.logs[0]).toMatchObject({
      delta: 0,
      startTime: Date.now(),
      state: "playing",
    });
  });

  describe("when paused is called after 5 seconds", () => {
    it("should start with a delta of 0 then 5000 ", async () => {
      const swcont = setup();
      swcont.play();
      await vitest.advanceTimersByTimeAsync(5000);
      swcont.pause();
      expect(logger.logs.map((state) => state?.delta)).toMatchObject([0, 5000]);
    });

    describe("when play is called after 5 seconds", () => {
      it("should start with a delta of 0, 5000, and 5000 ", async () => {
        const swcont = setup();
        swcont.play();
        await vitest.advanceTimersByTimeAsync(5000);
        swcont.pause();
        await vitest.advanceTimersByTimeAsync(5000);
        swcont.play();
        expect(logger.logs.map((state) => state?.delta)).toMatchObject([
          0, 5000, 5000,
        ]);
      });
    });

    describe("when pause is called after another 5 seconds", () => {
      it("should start with a delta of 0, 5000, 5000, 10000 ", async () => {
        const swcont = setup();
        swcont.play();
        await vitest.advanceTimersByTimeAsync(5000);
        swcont.pause();
        await vitest.advanceTimersByTimeAsync(5000);
        swcont.play();
        await vitest.advanceTimersByTimeAsync(5000);
        swcont.pause();
        expect(logger.logs.map((state) => state?.delta)).toMatchObject([
          0, 5000, 5000, 10000,
        ]);
      });
    });
  });

  describe.each([{ offset: 1 }, { offset: 3 }, { offset: 15 }])(
    "when pause is called after $offset seconds",
    ({ offset }) => {
      const offsetInMs = offset * 1000;

      it(`should return delta of 0 then ${offsetInMs}`, async () => {
        const swcont = setup();
        swcont.play();
        await vitest.advanceTimersByTimeAsync(offsetInMs);
        swcont.pause();
        expect(logger.logs.map((state) => state?.delta)).toMatchObject([
          0,
          offsetInMs,
        ]);
      });
    }
  );
});
