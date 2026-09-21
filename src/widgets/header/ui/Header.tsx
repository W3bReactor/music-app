import styles from "./Header.module.css";
import { SvgIcon } from "@/shared/ui";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.searchInput}>
          <SvgIcon name={"search"} size={25} />
          <input
            type="text"
            placeholder={"Search For Musics, Artists, ..."}
            className={styles.input}
          />
        </div>
        <ul className={styles.headerList}>
          <li className={styles.headerItem}>
            <Link className={styles.headerAbout} href={"/about"}>
              About Us
            </Link>
          </li>
          <li className={styles.headerItem}>
            <Link className={styles.headerAbout} href={"/upload"}>
              Upload
            </Link>
          </li>
          <li className={styles.headerItem}>
            <Link className={styles.headerAbout} href={"/premium"}>
              Premium
            </Link>
          </li>
        </ul>

        <div className={styles.headerProfile}>
          <Image
            src={""}
            width={40}
            height={40}
            alt={"avatar"}
            className={styles.headerProfileAvatar}
          />
          <span className={styles.headerProfileName}>User Name</span>
          <button className={styles.headerProfileBtn}>
            <SvgIcon name={"arrow_down"} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
