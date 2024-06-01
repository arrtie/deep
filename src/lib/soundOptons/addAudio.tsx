// add Audio
// takes a path
// fetches the path
// that promise is converted to a promise
// when it does its one emission
// added to collection of emissions
// all emissions are returned
// AudioNodes should all hook up to audiocontext

export class AudioSourceNode {
  audio: HTMLAudioElement;
  audioContext: AudioContext;
  source: MediaElementAudioSourceNode;
  constructor(audio: HTMLAudioElement, audioContext: AudioContext) {
    this.audio = audio;
    this.audioContext = audioContext;
    this.source = audioContext.createMediaElementSource(audio);
    this.source.connect(this.audioContext.destination);
    this.audio.onloadedmetadata = (e) => {
      console.log("onloadedmetadata", e);
    };
  }
  play() {
    this.audioContext.resume().then(() => {
      debugger;
      this.source.mediaElement.play();
    });
  }
  pause() {
    console.dir("source:", this);
    this.audioContext.suspend();
  }
}
