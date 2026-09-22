import styles from "./HeaderIntro.module.css";
import { PurpleButton, TransparentButton } from "@/shared/ui";

export const HeaderIntro = () => {
  return (
    <div className={styles.headerIntro}>
      <h2 className={styles.headerIntroTitle}>
        All the <span>Best Songs</span> in One Place
      </h2>
      <p className={styles.headerIntroDesc}>
        On our website, you can access an amazing collection of popular and new
        songs. Stream your favorite tracks in high quality and enjoy without
        interruptions. Whatever your taste in music, we have it all for you!
      </p>
      <div className={styles.headerIntroBtns}>
        <PurpleButton>Discover Now</PurpleButton>
        <TransparentButton>Create Playlist</TransparentButton>
      </div>
    </div>
  );
};
