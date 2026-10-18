import styles from "./AccentInput.module.css";
import { UseFormRegisterReturn } from "react-hook-form";
import cn from "classnames";

interface AccentInputProps {
  className?: string;
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  args: UseFormRegisterReturn;
  error?: string;
}

export const AccentInput = ({
  className,
  label,
  id,
  placeholder,
  type = "text",
  args,
  error,
}: AccentInputProps) => {
  return (
    <div className={cn(styles.formItem, className)}>
      <label className={styles.formLabel} htmlFor={id}>
        {label}
      </label>
      {error && <p className={styles.formError}>{error}</p>}
      <input
        placeholder={placeholder}
        className={styles.formInput}
        type={type}
        id={id}
        {...args}
      />
    </div>
  );
};
