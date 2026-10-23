"use client";
import { useRef } from "react";
import styles from "./AudioWave.module.css";

interface AudioWaveProps {
  peaks: number[];
  progress: number; // 0..1
  onSeek: (ratio: number) => void;
}

const MIN_BAR = 0.08;

export const AudioWave = ({ peaks, progress, onSeek }: AudioWaveProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const max = Math.max(...peaks, 1e-6);

  const bars = peaks.map((p, i) => (
    <span
      key={i}
      className={styles.bar}
      style={{ height: `${Math.max(p / max, MIN_BAR) * 100}%` }}
    />
  ));

  const seekFromEvent = (e: React.PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect();
    // Процент в элементе .track относительно места курсора т.е cursorPosition/elementWidth
    const ratio = (e.clientX - rect.left) / rect.width;

    onSeek(Math.min(1, Math.max(0, ratio)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromEvent(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) seekFromEvent(e);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") onSeek(Math.min(1, progress + 0.02));
    if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.02));
  };

  return (
    <div
      ref={trackRef}
      className={styles.track}
      style={{ "--progress": `${progress * 100}%` } as React.CSSProperties}
      role="slider"
      tabIndex={0}
      aria-label="Перемотка"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className={styles.bars}>{bars}</div>
      <div className={`${styles.bars} ${styles.played}`}>{bars}</div>
    </div>
  );
};
