import styles from "./GrayButton.module.css";

interface GrayButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const GrayButton = ({ children, className }: GrayButtonProps) => {
  return (
    <button className={`${styles.btnGray} ${className ? className : ""}`}>
      {children}
    </button>
  );
};
