import styles from "./AccentSelect.module.css";
import { UseFormRegisterReturn } from "react-hook-form";
import cn from "classnames";
import { SvgIcon } from "@/shared/ui";

interface AccentSelectProps {
  className?: string;
  label: string;
  id: string;
  // placeholder: string;
  type?: string;
  args: UseFormRegisterReturn;
  error?: string;
  currentValue: string;
}

export const AccentSelect = ({
  className,
  label,
  id,
  args,
  error,
  currentValue,
}: AccentSelectProps) => {
  return (
    <div className={cn(styles.formItem, className)}>
      <label className={styles.formLabel} htmlFor={id}>
        {label}
      </label>
      {error && <p className={styles.formError}>{error}</p>}
      <div className={styles.selectWrapper}>
        <select
          className={cn(styles.formSelect, {
            [styles.formSelectActive]: currentValue,
          })}
          id={id}
          defaultValue=""
          aria-invalid={!!error}
          {...args}
        >
          <option className={styles.formOption} value="" disabled>
            Select a Role
          </option>
          <option value="Engineer">Engineer</option>
          <option value="Designer">Designer</option>
          <option value="Admin">Admin</option>
        </select>
        <SvgIcon
          name="chevron"
          className={styles.selectIcon}
          size={20}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
