"use client";
import {
  QueueItem,
  selectCurrentQueueItem,
  selectIsPlaying,
  selectPause,
  selectPlay,
  selectPlayQueue,
  usePlayerStore,
} from "@/entities/player";
import { ComponentProps, ReactNode } from "react";

interface PlayBtnProps extends ComponentProps<"button"> {
  className?: string;
  item: QueueItem;
  playingSlot: ReactNode;
  pausedSlot: ReactNode;
}

export const PlayBtn = ({
  className,
  item,
  playingSlot,
  pausedSlot,
  ...props
}: PlayBtnProps) => {
  const currentItem = usePlayerStore(selectCurrentQueueItem);
  const isCurrentItem = currentItem && currentItem.id === item.id;
  const isPlaying = usePlayerStore(selectIsPlaying);

  const play = usePlayerStore(selectPlay);
  const playQueue = usePlayerStore(selectPlayQueue);
  const pause = usePlayerStore(selectPause);
  const toggle = async () => {
    if (isCurrentItem) {
      if (isPlaying) {
        pause();
      } else {
        await play();
      }
    } else {
      await playQueue([item], 0);
    }
  };

  return (
    <button
      aria-label={isCurrentItem && isPlaying ? "Pause" : "Play"}
      onClick={toggle}
      className={className}
      {...props}
    >
      {isCurrentItem && isPlaying ? playingSlot : pausedSlot}
    </button>
  );
};
