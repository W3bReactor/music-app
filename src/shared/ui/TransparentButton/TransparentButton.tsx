import styles from "./TransparentButton.module.css";

interface TransparentButtonProps {
  children: React.ReactNode;
}

export const TransparentButton = ({ children }: TransparentButtonProps) => {
  return <button className={styles.btnTransparent}>{children}</button>;
};
