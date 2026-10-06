import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { ConfirmDialogHost } from "../ui/confirm-dialog.js";
import { Toaster, toast } from "../ui/toaster.js";

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
            toast.error("Action failed", {
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
      <Toaster />
      <ConfirmDialogHost />
    </QueryClientProvider>
  );
}
