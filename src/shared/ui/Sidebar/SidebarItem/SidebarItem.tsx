"use client";
import styles from "./SidebarItem.module.css";
import { SvgIcon } from "@/shared/ui";
import Link from "next/link";
import { useState } from "react";

interface SidebarItemProps {
  className?: string;
  href: string;
  svgIconName: string;
  active?: boolean;
  variant?: "basic" | "logout" | "playlist";
  text: string;
}

export const SidebarItem = ({
  className,
  href,
  svgIconName,
  active,
  variant = "basic",
  text,
}: SidebarItemProps) => {
  const [hover, setHover] = useState(false);

  return (
    <li
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ""} ${variant === "playlist" ? styles.sidebarItemPlaylist : ""} ${variant === "logout" ? styles.sidebarItemLogout : ""} ${className ? className : ""}`}
    >
      <Link href={href} className={styles.sidebarItemLink}>
        <SvgIcon
          className={styles.sidebarItemIcon}
          name={svgIconName}
          size={active ? 24 : 16}
        />
        <h3 className={styles.sidebarItemTitle}>{text}</h3>
      </Link>
    </li>
  );
};
