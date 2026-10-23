"use client";
import { useRef } from "react";
import styles from "./VolumeProgress.module.css";

interface VolumeProgressProps {
  value: number; // 0..1
  onChange: (value: number) => void;
}

export const VolumeProgress = ({ value, onChange }: VolumeProgressProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (e: React.PointerEvent) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onChange(Math.min(1, Math.max(0, ratio)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "ArrowRight" || e.key === "ArrowUp")
      onChange(Math.min(1, value + 0.05));
    if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      onChange(Math.max(0, value - 0.05));
  };

  return (
    <div
      ref={trackRef}
      className={styles.slider}
      style={{ "--value": `${value * 100}%` } as React.CSSProperties}
      role="slider"
      tabIndex={0}
      aria-label="Громкость"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
    </div>
  );
};
