export type ArdioContextType = {
  audioContext: AudioContext;
};

type ControllerPlay = (startTime?: number, stop?: number) => Promise<void>;

export type BaseController = ArdioContextType & {
  isInitialized: boolean;
  play: ControllerPlay;
  pause: () => void;
  stop: (timePlayed: number) => void;
};
