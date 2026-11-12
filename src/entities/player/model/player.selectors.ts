import { PlayerState } from "./player.store";

export const selectIsPlaying = (state: PlayerState) => state.isPlaying;
export const selectVolume = (state: PlayerState) => state.volume;
export const selectDuration = (state: PlayerState) => state.duration;
export const selectCurrentQueueItem = (state: PlayerState) =>
  state.tracksQueue[state.currentQueueIndex];
export const selectPlay = (state: PlayerState) => state.play;
export const selectPlayQueue = (state: PlayerState) => state.playQueue;
export const selectPause = (state: PlayerState) => state.pause;
export const selectToggleMute = (state: PlayerState) => state.toggleMute;
export const selectSetVolume = (state: PlayerState) => state.setVolume;
export const selectNext = (state: PlayerState) => state.next;
export const selectPrev = (state: PlayerState) => state.prev;
export const selectSeek = (state: PlayerState) => state.seek;
