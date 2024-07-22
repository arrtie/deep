import { ArdioContext } from ".";
import { handleGetAudio } from "../api/audio";
import { ArdioContextType, BaseController } from "./types";

type AudioController = BaseController & {
  src: string;
  bufferSource: AudioBufferSourceNode;
  getDelta: () => number;
  playStart: undefined | number;
  pauseStart: undefined | number;
};

async function handleAudioConnection(src: string, controller: AudioController) {
  const response = await handleGetAudio(src, controller.audioContext);
  if (response == null) {
    return;
  }
  controller.bufferSource.buffer = response;
  controller.bufferSource.connect(controller.audioContext.destination);
  controller.isInitialized = true;
}

function createAudioController(src: string, ardioContext: ArdioContextType) {
  const AudioController: AudioController = Object.create(ardioContext);
  AudioController.bufferSource = ArdioContext.audioContext.createBufferSource();
  AudioController.isInitialized = false;
  handleAudioConnection(src, AudioController);

  AudioController.stop = function (stop?: number) {
    this.bufferSource.stop(stop);
  };

  AudioController.play = async function play(start = 0, stop) {
    return this.audioContext
      .resume()
      .then(() => {
        this.bufferSource.start(start, start, stop);
        this.playStart = performance.now();
      })
      .catch((error) => console.error(error))
      .finally(() => console.log("AudioController: Play: Finally"));
  };

  AudioController.pause = function pause() {
    this.audioContext.suspend();
    this.pauseStart = performance.now();
  };

  AudioController.getDelta = function getDelta() {
    return this.pauseStart && this.playStart
      ? this.pauseStart - this.playStart
      : 0;
  };
  return AudioController;
}

export function AudioController(src: string) {
  return createAudioController(src, ArdioContext);
}
