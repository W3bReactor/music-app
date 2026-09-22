import styles from "./PurpleButton.module.css";

interface PurpleButtonProps {
  children: React.ReactNode;
}

export const PurpleButton = ({ children }: PurpleButtonProps) => {
  return <button className={styles.btnPurple}>{children}</button>;
};
