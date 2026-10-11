import styles from "./GrayButton.module.css";
import cn from "classnames";

interface GrayButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const GrayButton = ({ children, className }: GrayButtonProps) => {
  return <button className={cn(styles.btnGray, className)}>{children}</button>;
};
