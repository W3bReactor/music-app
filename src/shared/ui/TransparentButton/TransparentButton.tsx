import styles from "./TransparentButton.module.css";
import cn from "classnames";

interface TransparentButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const TransparentButton = ({
  children,
  className,
}: TransparentButtonProps) => {
  return (
    <button className={cn(styles.btnTransparent, className)}>{children}</button>
  );
};
