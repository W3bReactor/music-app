import { usePlayerStore } from "./player.store";

let audio: HTMLAudioElement | null = null;

// Чтобы не хранить всё в одном файле и не усложнять, эта функция знает про store
const attachListeners = (audio: HTMLAudioElement) => {
  audio.addEventListener("play", () => {
    usePlayerStore.setState({ isPlaying: true });
  });
  audio.addEventListener("pause", () => {
    usePlayerStore.setState({ isPlaying: false });
  });
  audio.addEventListener("ended", async () => {
    usePlayerStore.setState({ isPlaying: false });
    await usePlayerStore.getState().next();
  });
  // Синхронизация звука в стейте и audio
  audio.addEventListener("volumechange", function () {
    usePlayerStore.setState({ volume: this.volume });
  });

  audio.addEventListener("durationchange", function () {
    if (Number.isFinite(this.duration)) {
      usePlayerStore.setState({ duration: this.duration });
    }
  });
};

const createAudio = () => {
  audio = new Audio();
  attachListeners(audio);
  return audio;
};

export const getAudio = () => {
  if (!audio) {
    return createAudio();
  }
  return audio;
};

export const setAudioSrc = (src: string) => {
  const audio = getAudio();
  audio.src = src;
};

export const setAudioVolume = (volume: number) => {
  const audio = getAudio();
  audio.volume = volume;
};

export const setAudioCurrentTime = (currentTime: number) => {
  const audio = getAudio();
  audio.currentTime = currentTime;
};

export const setAudioPause = () => {
  const audio = getAudio();
  audio.pause();
};

export const setAudioPlay = async () => {
  const audio = getAudio();
  await audio.play();
};

export const getAudioDuration = () => {
  const audio = getAudio();
  return audio.duration;
};

export const isHaveAudioSrc = () => {
  const audio = getAudio();
  return audio.src !== "";
};

export const subscribeToTime = (cb: (time: number) => void) => {
  const audio = getAudio();
  const notify = () => {
    cb(audio.currentTime);
  };
  audio.addEventListener("timeupdate", notify);
  notify();
  return () => {
    audio.removeEventListener("timeupdate", notify);
  };
};
