import styles from "./Header.module.css";
import { SvgIcon } from "@/shared/ui";
import Link from "next/link";
import Image from "next/image";
import AvatarIcon from "./avatar.svg";
import { SearchInput } from "@/features/search";
import { HeaderIntro } from "@/widgets/header/ui/HeaderIntro/HeaderIntro";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <SearchInput />
        <ul className={styles.headerList}>
          <li className={styles.headerItem}>
            <Link className={styles.headerItemLink} href={"/about"}>
              About Us
            </Link>
          </li>
          <li className={styles.headerItem}>
            <Link className={styles.headerItemLink} href={"/upload"}>
              Upload
            </Link>
          </li>
          <li className={styles.headerItem}>
            <Link className={styles.headerItemLink} href={"/premium"}>
              Premium
            </Link>
          </li>
        </ul>

        <div className={styles.headerProfile}>
          <Image
            src={AvatarIcon}
            width={40}
            height={40}
            alt={"avatar"}
            className={styles.headerProfileAvatar}
          />
          <button className={styles.headerProfileBtn}>
            <span className={styles.headerProfileName}>User Name</span>
            <SvgIcon name={"arrow_down"} size={24} />
          </button>
        </div>
      </div>
      <HeaderIntro />
    </header>
  );
};
