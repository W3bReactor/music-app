import styles from "./Sidebar.module.css";
import { SidebarItem } from "@/shared/ui/Sidebar/SidebarItem/SidebarItem";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.sidebarTitle}>Melodies</h1>
      <div className={styles.sidebarBlock}>
        <h2 className={styles.sidebarBlockTitle}>Menu</h2>
        <ul className={styles.sidebarList}>
          <SidebarItem
            href={"/"}
            svgIconName={"home"}
            className={styles.sidebarItem}
            active={true}
            text={"Home"}
          />
          <SidebarItem
            href={"/discover"}
            svgIconName={"discover"}
            className={styles.sidebarItem}
            text={"Discover"}
          />
          <SidebarItem
            href={"/albums"}
            svgIconName={"albums"}
            className={styles.sidebarItem}
            text={"Albums"}
          />
          <SidebarItem
            href={"/artists"}
            svgIconName={"artists"}
            className={styles.sidebarItem}
            text={"Artists"}
          />
        </ul>
      </div>
      <div className={styles.sidebarBlock}>
        <h2 className={styles.sidebarBlockTitle}>Library</h2>
        <ul className={styles.sidebarList}>
          <SidebarItem
            href={"/recently"}
            svgIconName={"recently"}
            className={styles.sidebarItem}
            text={"Recently Added"}
          />
          <SidebarItem
            href={"/most"}
            svgIconName={"played"}
            className={styles.sidebarItem}
            text={"Most played"}
          />
        </ul>
      </div>
      <div className={styles.sidebarBlock}>
        <h2 className={styles.sidebarBlockTitle}>Playlist and favorite</h2>
        <ul className={styles.sidebarList}>
          <SidebarItem
            href={"/favorite"}
            svgIconName={"favorite"}
            className={styles.sidebarItem}
            text={"Your favorites"}
          />
          <SidebarItem
            href={"/playlist"}
            svgIconName={"playlist"}
            className={styles.sidebarItem}
            text={"Your playlist"}
          />
          <SidebarItem
            href={"/add-playlist"}
            svgIconName={"add_playlist"}
            className={styles.sidebarItem}
            variant={"playlist"}
            text={"Add playlist"}
          />
        </ul>
      </div>
      <div className={styles.sidebarBlock}>
        <h2 className={styles.sidebarBlockTitle}>general</h2>
        <ul className={styles.sidebarList}>
          <SidebarItem
            href={"/settings"}
            svgIconName={"settings"}
            className={styles.sidebarItem}
            text={"Setting"}
          />
          <SidebarItem
            href={"/logout"}
            svgIconName={"logout"}
            className={styles.sidebarItem}
            variant={"logout"}
            text={"Logout"}
          />
        </ul>
      </div>
    </aside>
  );
};
