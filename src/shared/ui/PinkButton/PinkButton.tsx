import styles from "./PinkButton.module.css";
import cn from "classnames";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type PinkButtonProps =
  | ({
      href?: undefined;
      children: ReactNode;
      className?: string;
    } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({
      href: string;
      children: ReactNode;
      className?: string;
    } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">);

export const PinkButton = (props: PinkButtonProps) => {
  if (props.href !== undefined) {
    const { href, children, className, ...linkProps } = props;

    return (
      <Link
        {...linkProps}
        href={href}
        className={cn(styles.btnPurple, className)}
      >
        {children}
      </Link>
    );
  }

  const { children, className, ...buttonProps } = props;

  return (
    <button {...buttonProps} className={cn(styles.btnPurple, className)}>
      {children}
    </button>
  );
};
