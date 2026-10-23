"use client";
import { useEffect, useRef, useState } from "react";

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  // подписка на события внешней системы, один раз
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    let raf = 0;
    const tick = () => {
      setCurrentTime(a.currentTime);
      raf = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      setIsPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(raf);
      setCurrentTime(a.currentTime);
    };
    const onMeta = () => {
      if (Number.isFinite(a.duration)) setDuration(a.duration);
    };
    const onSeeked = () => setCurrentTime(a.currentTime);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("seeked", onSeeked);
    onMeta();

    return () => {
      cancelAnimationFrame(raf);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const seek = (ratio: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = ratio * a.duration;
    setCurrentTime(a.currentTime);
  };

  const setVolume = (v: number) => {
    const a = audioRef.current;
    if (a) {
      a.volume = v;
      a.muted = v === 0;
    }
    setVolumeState(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (a) a.muted = !a.muted;
    setMuted((m) => !m);
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    volume: muted ? 0 : volume,
    setVolume,
    toggleMute,
  };
};
