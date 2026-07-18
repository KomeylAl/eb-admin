"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.log(error);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
