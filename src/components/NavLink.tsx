"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface NavLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
}

export function NavLink({ href, className, activeClassName, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={cn(className, isActive && activeClassName)} {...props} />
  );
}

export default NavLink;
