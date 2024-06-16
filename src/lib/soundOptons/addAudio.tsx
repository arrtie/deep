// add Audio
// takes a path
// fetches the path
// that promise is converted to a promise
// when it does its one emission
// added to collection of emissions
// all emissions are returned
// AudioNodes should all hook up to audiocontext

const audioSourceNodeMap = new Map<string, AudioSourceNode>();

export function makeAudioSourceNode(
  audio: HTMLAudioElement,
  audioContext: AudioContext
) {
  const existingSourceNode = audioSourceNodeMap.get(audio.src);
  if (existingSourceNode != null) {
    return existingSourceNode;
  }
  return new AudioSourceNode(audio, audioContext);
}

export class AudioSourceNode {
  audio: HTMLAudioElement;
  audioContext: AudioContext;
  source: MediaElementAudioSourceNode;
  playStart: undefined | number;
  pauseStart: undefined | number;

  constructor(audio: HTMLAudioElement, audioContext: AudioContext) {
    this.audio = audio;
    this.audioContext = audioContext;
    this.source = audioContext.createMediaElementSource(audio);
    this.source.connect(audioContext.destination);

    this.audio.onloadedmetadata = (e) => {
      console.log("onloadedmetadata", e);
    };
    this.audio.onerror = (e) => {
      console.error(
        `Error ${this?.audio?.error?.code}; details: ${this?.audio?.error?.message}`
      );
    };
    audioSourceNodeMap.set(audio.src, this);
  }

  play() {
    this.audioContext.resume().then(() => {
      this.source.mediaElement.play();
      this.playStart = performance.now();
    });
  }

  pause() {
    this.audioContext.suspend();
    this.pauseStart = performance.now();
  }

  getDelta() {
    return this.pauseStart && this.playStart
      ? this.pauseStart - this.playStart
      : 0;
  }
}
