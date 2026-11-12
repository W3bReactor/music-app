"use client";
import styles from "./Player.module.css";
import Image from "next/image";
import playerPreviewImage from "./track-preview.jpg";
import volumeIcon from "./volume.svg";
import cn from "classnames";
import { SvgIcon, VolumeProgress } from "@/shared/ui";
import {
  selectIsPlaying,
  selectNext,
  selectPause,
  selectPlay,
  selectPrev,
  selectSetVolume,
  selectToggleMute,
  selectVolume,
  usePlayerStore,
} from "@/entities/player";
import { PlayerProgress } from "./PlayerProgress/PlayerProgress";

export const Player = () => {
  const isPlaying = usePlayerStore(selectIsPlaying);
  const volume = usePlayerStore(selectVolume);
  const toggleMute = usePlayerStore(selectToggleMute);
  const setVolume = usePlayerStore(selectSetVolume);
  const next = usePlayerStore(selectNext);
  const prev = usePlayerStore(selectPrev);
  const play = usePlayerStore(selectPlay);
  const pause = usePlayerStore(selectPause);

  const toggle = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  return (
    <div className={styles.player}>
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
            type="button"
            aria-label={"Previous Track"}
            className={cn(styles.playerControlButton, styles.playerControlPrev)}
            onClick={prev}
          >
            <SvgIcon
              name={"next"}
              className={cn(
                styles.playerControlIcon,
                styles.playerControlPrevIcon
              )}
              size={15}
            />
          </button>
          <button
            className={cn(styles.playerControlButton, styles.playerControlPlay)}
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={toggle}
          >
            {isPlaying ? (
              <SvgIcon
                className={cn(
                  styles.playerControlIcon,
                  styles.playerControlPlayIcon
                )}
                name={"playing"}
              />
            ) : (
              <SvgIcon
                className={cn(
                  styles.playerControlIcon,
                  styles.playerControlPlayIcon
                )}
                name={"play"}
              />
            )}
          </button>
          <button
            type="button"
            aria-label={"Next Track"}
            className={cn(styles.playerControlButton, styles.playerControlNext)}
            onClick={next}
          >
            <SvgIcon
              name={"next"}
              className={cn(
                styles.playerControlIcon,
                styles.playerControlNextIcon
              )}
              size={15}
            />
          </button>
        </div>
        <PlayerProgress />
      </div>

      <div className={styles.playerVolume}>
        <button
          aria-label={volume === 0 ? "Unmute" : "Mute"}
          onClick={toggleMute}
          className={styles.playerVolumeBtn}
        >
          <Image src={volumeIcon} alt={"Volume"} />
        </button>
        <div className={styles.playerVolumeProgress}>
          <VolumeProgress value={volume} onChange={setVolume} />
        </div>
      </div>
    </div>
  );
};
