import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantClass = {
  primary: "bg-ink text-bone hover:bg-clay",
  secondary: "border border-ink/20 bg-bone text-ink hover:border-bronze hover:text-clay",
  ghost: "text-ink underline decoration-bronze/50 underline-offset-8 hover:text-clay"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `inline-flex min-h-11 items-center justify-center rounded-sm px-5 py-3 text-sm font-semibold transition ${variantClass[variant]} ${className}`;

  if (isExternal) {
    return (
      <a className={classes} href={href} rel="noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
