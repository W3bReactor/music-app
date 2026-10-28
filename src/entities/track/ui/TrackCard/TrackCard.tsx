import Link from "next/link";
import styles from "./TrackCard.module.css";
import Image from "next/image";
import trackPreviewImage from "./track-preview-1.jpg";

interface TrackCardProps {
  title: string;
  artist: string;
  duration: string;
  id: number;
  image?: string;
}

export const TrackCard = ({
  title,
  artist,
  duration,
  id,
  image,
}: TrackCardProps) => {
  return (
    <Link href={`/music/${id}`} className={styles.trackCard}>
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
  );
};
