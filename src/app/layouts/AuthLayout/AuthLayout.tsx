import styles from "./AuthLayout.module.css";
import { ReactNode } from "react";
import { PausePlayer } from "@/features/pause-player";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className={styles.page}>
      <PausePlayer />
      <div className={styles.card}>{children}</div>
    </section>
  );
};
