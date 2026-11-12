"use client";
import { useEffect } from "react";
import { selectIsPlaying, selectPause, usePlayerStore } from "@/entities/player";

// Гасит воспроизведение при монтировании и сам ничего не рендерит.
// Нужен там, где плеер не должен звучать (например, на страницах авторизации).
export const PausePlayer = () => {
  const isPlaying = usePlayerStore(selectIsPlaying);
  const pause = usePlayerStore(selectPause);

  useEffect(() => {
    if (isPlaying) {
      pause();
    }
  }, [isPlaying, pause]);

  return null;
};
