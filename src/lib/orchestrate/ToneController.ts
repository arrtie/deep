import { ArdioContext } from ".";
import { ArdioContextType, BaseController } from "./types";

function createTone(ArdioContext: ArdioContextType, options?: ToneOptions) {
  type CreateTone = BaseController & {
    oscillator: OscillatorNode;
  };

  const Tone: CreateTone = Object.create(ArdioContext);
  Tone.oscillator = Tone.audioContext.createOscillator();
  Tone.oscillator.connect(Tone.audioContext.destination);
  Tone.isInitialized = true;

  Tone.play = async function (start = 0, stop?: number) {
    return Tone.audioContext.resume().then(() => {
      Tone.oscillator.start(start);
      if (stop != null) {
        Tone.stop(stop);
        return;
      }
      if (options?.defaultStop != null) {
        Tone.stop(options.defaultStop);
      }
    });
  };

  Tone.pause = function () {
    Tone.audioContext.suspend();
  };

  Tone.stop = function (elapsedTime: number) {
    Tone.oscillator.stop(Tone.audioContext.currentTime + elapsedTime);
  };

  return Tone;
}

export type ToneController = ReturnType<typeof createTone>;
export type ToneOptions = Partial<{ defaultStop: number; volume: number }>;
export function ToneController(options?: ToneOptions) {
  return createTone(ArdioContext, options);
}
