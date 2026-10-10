import styles from "./ProfileFavorite.module.css";
import { MediaItem } from "@/shared/ui/MediaItem/MediaItem";
import { GrayButton } from "@/shared/ui/GrayButton/GrayButton";

export const ProfileFavorite = () => {
  return (
    <section className={styles.favorite}>
      <h2 className={styles.favoriteTitle}>Favorite</h2>
      <div className={styles.favoriteHeader}>
        <GrayButton className={styles.favoriteBtn}>Tracks</GrayButton>
        <GrayButton className={styles.favoriteBtn}>Playlists</GrayButton>
      </div>
      <ul className={styles.favoriteList}>
        <MediaItem
          href="/"
          title={"Sad Playlist"}
          description={"Playlist - 23 tracks"}
          className={styles.favoriteItem}
        />
      </ul>
    </section>
  );
};
