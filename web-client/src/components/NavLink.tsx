import { cn } from "@/shared/utils/css";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button, ButtonProps } from "./ui/button";

interface NavLinkProps extends ButtonProps {
  children: ReactNode;
  to: string;
  className?: string;
}

export function NavLink({ children, to, className, ...props }: NavLinkProps) {
  return (
    <Button
      variant="link"
      asChild
      className={cn("p-0 text-foreground", className)}
      {...props}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}
