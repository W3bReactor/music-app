import styles from "./ProfileInfo.module.css";
import Image from "next/image";
import { AvatarIcon } from "@/shared/ui";
import EditIcon from "./edit.svg";

export const ProfileInfo = () => {
  return (
    <section className={styles.info}>
      {/* TODO: GET DATA */}
      <div className={styles.infoImageWrapper}>
        <Image
          className={styles.infoImage}
          src={AvatarIcon}
          alt={"Avatar"}
          width={198}
          height={198}
        />
      </div>
      <div className={styles.infoContent}>
        <div className={styles.infoProfile}>
          <span className={styles.infoSuptitle}>Profile</span>
          <h2 className={styles.infoTitle}>WebReactor</h2>
          <ul className={styles.infoList}>
            <li className={styles.infoItem}>5 favorite tracks</li>
            <li className={styles.infoItem}>1 favorite albums</li>
          </ul>
          <span className={styles.infoListen}>Now listening: Nothing</span>
        </div>
        {/* TODO: ITS FEATURE */}
        <button className={styles.infoEdit}>
          <Image className={styles.infoEditIcon} src={EditIcon} alt={"Edit"} />
          Edit Profile
        </button>
      </div>
    </section>
  );
};
