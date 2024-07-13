const theAudioContext = new AudioContext();
function createTone(audioContext: AudioContext) {
  const ArdioContext = {
    audioContext: theAudioContext,
  };

  type ArdioContext = typeof ArdioContext;

  // tone
  type CreateTone = ArdioContext & {
    oscillator: OscillatorNode;
    play: () => Promise<void>;
    pause: () => void;
    stop: (timePlayed: number) => void;
  };

  const Tone: CreateTone = Object.create(ArdioContext);

  Tone.play = async function () {
    return Tone.audioContext.resume().then(() => {
      Tone.oscillator.start(0);
    });
  };

  Tone.pause = function () {
    Tone.audioContext.suspend();
  };

  Tone.stop = function (timePlayed: number) {
    Tone.oscillator.stop(timePlayed);
  };

  return theAudioContext;
}
