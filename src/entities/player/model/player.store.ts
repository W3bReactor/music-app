import { create } from "zustand";
import {
  getAudioDuration,
  isHaveAudioSrc,
  setAudioCurrentTime,
  setAudioPause,
  setAudioPlay,
  setAudioSrc,
  setAudioVolume,
} from "./audio";
import { getMockAudioUrl } from "@/shared/libs/mockAudio";

export interface PlayerState {
  isPlaying: boolean;
  tracksQueue: QueueItem[];
  currentQueueIndex: number;
  volume: number;
  play(): Promise<void>;
  playQueue(tracksQueue: QueueItem[], currentQueueIndex: number): Promise<void>;
  pause: () => void;
  prev: () => Promise<void>;
  next: () => Promise<void>;
  toggleMute: () => void;
  savedVolume: number;
  setVolume: (volume: number) => void;
  seek: (ratio: number) => void;
  duration: number;
}

export interface QueueItem {
  id: number;
  // TODO: Станет обязательным, когда треки будут приходить с настоящим аудио
  audioUrl?: string;
}

// TODO: Убрать мок, когда у элементов очереди появится настоящий audioUrl
const resolveAudioUrl = (item: QueueItem) => item.audioUrl ?? getMockAudioUrl();

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  isPlaying: false,
  // Очередь треков
  tracksQueue: [
    {
      id: 1,
      // TODO: Убрать как появяться настоящие данные
      audioUrl: getMockAudioUrl(331),
    },
    {
      id: 2,
      audioUrl: getMockAudioUrl(105),
    },
  ],
  // Индекс в массиве из очереди треков
  currentQueueIndex: 0,
  volume: 1,
  savedVolume: 1,
  duration: 0,

  play: async () => {
    const { tracksQueue, currentQueueIndex } = get();
    if (!isHaveAudioSrc() && tracksQueue.length !== 0) {
      setAudioSrc(resolveAudioUrl(tracksQueue[currentQueueIndex]));
    }
    try {
      await setAudioPlay();
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      console.error(e);
    }
  },
  playQueue: async function (tracksQueue, currentQueueIndex) {
    set({ tracksQueue });
    await setNewTrack(currentQueueIndex);
  },
  pause: () => {
    setAudioPause();
  },
  prev: async function () {
    const { currentQueueIndex } = get();
    await setNewTrack(currentQueueIndex - 1);
  },
  next: async function () {
    const { currentQueueIndex } = get();
    await setNewTrack(currentQueueIndex + 1);
  },
  toggleMute: () => {
    const { volume, savedVolume } = get();
    if (volume > 0) {
      setAudioVolume(0);
      set({ savedVolume: volume });
    } else {
      setAudioVolume(savedVolume);
    }
  },
  setVolume: (volume) => {
    setAudioVolume(volume);
  },
  seek: (ratio: number) => {
    const duration = getAudioDuration();
    if (!Number.isFinite(duration)) return;
    setAudioCurrentTime(ratio * duration);
  },
}));

const setNewTrack = async (newIndex: number) => {
  const tracksQueue = usePlayerStore.getState().tracksQueue;

  if (tracksQueue.length === 0) {
    return;
  }
  if (newIndex < 0 || tracksQueue.length <= newIndex) {
    newIndex = 0;
  }
  usePlayerStore.setState({ currentQueueIndex: newIndex });
  setAudioSrc(resolveAudioUrl(tracksQueue[newIndex]));
  await usePlayerStore.getState().play();
};
