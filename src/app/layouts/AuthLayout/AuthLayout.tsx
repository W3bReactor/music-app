import styles from "./AuthLayout.module.css";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className={styles.page}>
      <div className={styles.card}>{children}</div>
    </section>
  );
};
