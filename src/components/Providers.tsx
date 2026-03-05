"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
