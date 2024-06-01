type AudioContextType = {
  audioCtx: Record<string, AudioContext | undefined>;
  gainNode: Record<string, GainNode | undefined>;
  audioNodes: HTMLAudioElement[];
  ready: boolean;
};
const audioCtx = { current: undefined };
const gainNode = { current: undefined };

const singleton: AudioContextType = {
  audioCtx,
  gainNode,
  audioNodes: [],
  ready: false,
};

export function setup() {
  if (
    singleton.audioCtx.current != null &&
    singleton.gainNode.current != null
  ) {
    return {
      audioCtx: singleton.audioCtx.current,
      gainNode: singleton.gainNode.current,
    };
  }
  singleton.audioCtx.current = new AudioContext();
  singleton.gainNode.current = singleton.audioCtx.current.createGain();
  singleton.gainNode.current.connect(singleton.audioCtx.current.destination);
  singleton.ready = true;
  singleton.audioCtx.current.onstatechange = () =>
    console.log("state change: ", singleton.audioCtx.current?.state);
  return {
    audioCtx: singleton.audioCtx.current,
    gainNode: singleton.gainNode.current,
  };
}

function connect(
  localAudio: HTMLAudioElement
): MediaElementAudioSourceNode | null {
  if (
    singleton.audioCtx.current == null ||
    singleton.gainNode.current == null
  ) {
    return null;
  }
  const audioSourceNode =
    singleton.audioCtx.current.createMediaElementSource(localAudio);
  audioSourceNode.connect(singleton.gainNode.current);
  return audioSourceNode;
}

function connectAudioToGain(
  audio: HTMLAudioElement | HTMLAudioElement[]
): MediaElementAudioSourceNode[] {
  if (Array.isArray(audio)) {
    const newAudio = audio.map(connect).filter((entry) => entry != null);
    return newAudio.includes(null)
      ? []
      : (newAudio as MediaElementAudioSourceNode[]);
  }
  const newAudio = connect(audio);
  return newAudio == null ? [] : [newAudio];
}

export function makeSourceNode(
  localAudio: HTMLAudioElement,
  audioCtx: AudioContext
) {
  return audioCtx.createMediaElementSource(localAudio);
}

export function addAudioToContext(
  audio: HTMLAudioElement | HTMLAudioElement[]
) {
  if (Array.isArray(audio)) {
    singleton.audioNodes.concat(audio);
  } else {
    singleton.audioNodes.push(audio);
  }
  connectAudioToGain(singleton.audioNodes);
}

export default singleton;
