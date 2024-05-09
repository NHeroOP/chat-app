"use client";

import { ThemeProvider } from "next-themes";
import { ContextProvider } from "@/context/ContextProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ContextProvider>
          {children}
        </ContextProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}