"use client";
import styles from "./Player.module.css";
import Image from "next/image";
import playerPreviewImage from "./track-preview.jpg";
import nextTrackIcon from "./next-track.svg";
import playingIcon from "./playing.svg";
import playIcon from "./play.svg";
import volumeIcon from "./volume.svg";
import cn from "classnames";
import { useAudioPlayer } from "@/shared/libs/useAudioPlayer";
import { MOCK_PEAKS } from "@/shared/libs/mockPeaks";
import { AudioWave, VolumeProgress } from "@/shared/ui";
import { createMockAudioUrl } from "@/shared/libs/mockAudio";
import { useEffect } from "react";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const Player = () => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    volume,
    setVolume,
    toggleMute,
  } = useAudioPlayer();

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const url = createMockAudioUrl(331);
    a.src = url;
    return () => URL.revokeObjectURL(url);
  }, [audioRef]);

  return (
    <div className={styles.player}>
      <audio ref={audioRef} preload="metadata" />
      <div className={styles.playerTrack}>
        <Image
          src={playerPreviewImage}
          alt={"Superman"}
          className={styles.playerTrackImage}
          width={98}
          height={98}
        />
        <div className={styles.playerTrackInfo}>
          <h2 className={styles.playerTrackName}>Superman</h2>
          <span className={styles.playerTrackArtist}>Eminem</span>
        </div>
      </div>

      <div className={styles.playerControl}>
        <div className={styles.playerControlButtons}>
          <button
            className={cn(styles.playerControlButton, styles.playerControlPrev)}
          >
            <Image
              src={nextTrackIcon}
              alt={"Previous track"}
              className={styles.playerControlPrevIcon}
            />
          </button>
          <button
            className={cn(styles.playerControlButton, styles.playerControlPlay)}
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <Image
              src={isPlaying ? playingIcon : playIcon}
              alt={"Play/Stop"}
              className={styles.playerControlPlayIcon}
            />
          </button>
          <button
            className={cn(styles.playerControlButton, styles.playerControlNext)}
          >
            <Image
              src={nextTrackIcon}
              alt={"Next track"}
              className={styles.playerControlNextIcon}
            />
          </button>
        </div>
        <div className={styles.playerControlRoad}>
          <span className={styles.playerControlTime}>{fmt(currentTime)}</span>
          <div className={styles.playerControlRoadProgress}>
            <AudioWave
              peaks={MOCK_PEAKS}
              progress={duration ? currentTime / duration : 0}
              onSeek={seek}
            />
          </div>
          <span className={styles.playerControlTime}>{fmt(duration)}</span>
        </div>
      </div>

      <div className={styles.playerVolume}>
        <button className={styles.playerVolumeBtn}>
          <Image
            src={volumeIcon}
            alt={"Volume"}
            onClick={toggleMute}
            aria-label={volume === 0 ? "Включить звук" : "Выключить звук"}
          />
        </button>
        <div className={styles.playerVolumeProgress}>
          <VolumeProgress value={volume} onChange={setVolume} />
        </div>
      </div>
    </div>
  );
};
