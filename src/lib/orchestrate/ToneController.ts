import { ArdioContext } from ".";
import { ArdioContextType, BaseController } from "./types";

function createTone(ArdioContext: ArdioContextType) {
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
      }
    });
  };

  Tone.pause = function () {
    Tone.audioContext.suspend();
  };

  Tone.stop = function (elapsedTime = 0) {
    Tone.oscillator.stop(elapsedTime);
  };

  return Tone;
}

export type ToneController = ReturnType<typeof createTone>;

export function ToneController() {
  return createTone(ArdioContext);
}
