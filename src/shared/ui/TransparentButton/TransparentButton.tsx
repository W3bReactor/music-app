import styles from "./TransparentButton.module.css";

interface PurpleButtonProps {
  children: React.ReactNode;
}

export const TransparentButton = ({ children }: PurpleButtonProps) => {
  return <button className={styles.btnTransparent}>{children}</button>;
};
