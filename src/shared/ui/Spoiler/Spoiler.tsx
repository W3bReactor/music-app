"use client";
import styles from "./Spoiler.module.css";
import cn from "classnames";
import { SvgIcon } from "@/shared/ui";
import { useState } from "react";

interface SpoilerProps {
  title: string;
  text: string;
}

export const Spoiler = ({ title, text }: SpoilerProps) => {
  const [spoilerOpened, setSpoilerOpened] = useState(false);

  return (
    <div className={styles.trackSpoiler}>
      <button
        onClick={() => setSpoilerOpened((lo) => !lo)}
        className={styles.trackSpoilerBtn}
      >
        <h3 className={styles.trackSpoilerTitle}>{title}</h3>
        <SvgIcon
          name={"arrow-down"}
          className={cn(styles.trackArrowIcon, {
            [styles.trackArrowIconOpened]: spoilerOpened,
          })}
        />
      </button>
      <div
        className={cn(styles.trackTextWrapper, {
          [styles.trackTextWrapperOpened]: spoilerOpened,
        })}
      >
        <p className={styles.trackText}>{text}</p>
      </div>
    </div>
  );
};
