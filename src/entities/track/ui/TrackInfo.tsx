"use client";
import styles from "./TrackInfo.module.css";
import Image from "next/image";
import trackImage from "./track-preview.jpg";
import { SvgIcon } from "@/shared/ui";
import { useState } from "react";

export const TrackInfo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={styles.trackMainInfo}>
      <div className={styles.trackImageWrapper}>
        <Image
          src={trackImage}
          alt={"Superman track"}
          className={styles.trackImage}
        />
      </div>
      <div className={styles.trackContent}>
        <h2 className={styles.trackName}>Superman</h2>
        <span className={styles.trackArtist}>Eminem</span>
        <button
          onClick={() => setIsPlaying((ip) => !ip)}
          className={styles.trackPlayBtn}
        >
          {isPlaying ? (
            <SvgIcon name={"playing"} className={styles.trackPlayIcon} />
          ) : (
            <SvgIcon name={"play"} className={styles.trackPlayIcon} />
          )}
        </button>
        {/* IDEA: Возможно добавить ещё кнопку скачивания трека */}
      </div>
    </div>
  );
};
