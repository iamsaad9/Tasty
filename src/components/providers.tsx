"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { SessionProvider } from "next-auth/react";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider placement="bottom-center" />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
