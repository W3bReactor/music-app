import Link from "next/link";
import styles from "./TrackCard.module.css";
import Image from "next/image";
import trackPreviewImage from "./track-preview-1.jpg";
import type { Track } from "@/entities/track";
import { ReactNode } from "react";

interface TrackCardProps {
  track: Track;
  playSlot?: ReactNode;
}

export const TrackCard = ({ track, playSlot }: TrackCardProps) => {
  const { title, artist, duration, id, image } = track;

  return (
    <div className={styles.trackCard}>
      <Link href={`/music/${id}`} className={styles.trackLink}>
        <div className={styles.trackImageWrapper}>
          <Image
            width={162}
            height={150}
            src={image ? image : trackPreviewImage}
            alt={title}
            className={styles.trackImage}
          />
        </div>
        <h3 className={styles.trackTitle}>{title}</h3>
        <div className={styles.trackInfo}>
          <span className={styles.trackArtist}>{artist}</span>
          <span className={styles.trackTime}>{duration}</span>
        </div>
      </Link>
      {playSlot && <div className={styles.trackPlayWrapper}>{playSlot}</div>}
    </div>
  );
};
