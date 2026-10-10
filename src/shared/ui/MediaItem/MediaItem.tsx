import styles from "./MediaItem.module.css";
import Image from "next/image";
import { AvatarIcon } from "@/shared/ui";
import Link from "next/link";

interface MediaItemProps {
  className?: string;
  image?: string;
  title: string;
  description: string;
  href: string;
}

export const MediaItem = ({
  image,
  title,
  description,
  className,
  href,
}: MediaItemProps) => {
  return (
    <li className={`${styles.mediaItem} ${className ? className : ""}`}>
      <Link className={styles.mediaLinkWrapper} href={href}>
        <Image
          className={styles.mediaItemImage}
          src={image ? image : AvatarIcon}
          alt={title}
        />
        <h3 className={styles.mediaItemTitle}>{title}</h3>
        <p className={styles.mediaItemDesc}>{description}</p>
      </Link>
    </li>
  );
};
