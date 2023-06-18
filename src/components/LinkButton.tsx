import type { FC } from "react";
import React from "react";

interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const buttonStyle =
  "sm:text-md flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm text-primary outline-primary transition-all hover:scale-105 hover:font-medium hover:opacity-90";
export const buttonStyleDark =
  "sm:text-md flex items-center w-32 justify-center gap-1 rounded-full bg-primary px-5 py-2 text-sm text-primary text-white outline-primary transition-all hover:scale-105 hover:font-medium hover:opacity-90";

const LinkButton: FC<LinkButtonProps> = ({
  to,
  children,
  className,
  ...props
}) => {
  return (
    <a href={to}>
      <button className={[buttonStyleDark, className].join(" ")} {...props}>
        {props.icon}
        {children}
      </button>
    </a>
  );
};

export const LinkButtonDark: FC<LinkButtonProps> = ({
  to,
  children,
  className,
  ...props
}) => {
  return (
    <a href={to}>
      <button className={[buttonStyleDark, className].join(" ")} {...props}>
        {props.icon}
        {children}
      </button>
    </a>
  );
};

export default LinkButton;
