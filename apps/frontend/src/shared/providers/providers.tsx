import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { useState } from "react";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Please try again.";
}

export function Providers({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            Toast.toast.danger("Action failed", {
              description: getErrorMessage(error),
            });
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toast.Provider placement="bottom end" />
    </QueryClientProvider>
  );
}
