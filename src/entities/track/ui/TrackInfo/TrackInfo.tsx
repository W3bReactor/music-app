import styles from "./TrackInfo.module.css";
import Image from "next/image";
import trackImage from "./track-preview.jpg";
import { ReactNode } from "react";

interface TrackInfoProps {
  playSlot?: ReactNode;
}

export const TrackInfo = ({ playSlot }: TrackInfoProps) => {
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
        {playSlot}
        {/* IDEA: Возможно добавить ещё кнопку скачивания трека */}
      </div>
    </div>
  );
};
