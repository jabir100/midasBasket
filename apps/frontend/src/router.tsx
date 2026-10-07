import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen.js";
import { NotFoundPage, PageLoader } from "./shared/ui/status-pages.js";

export function getRouter(): RouterInstance {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 30_000,
    defaultNotFoundComponent: () => <NotFoundPage />,
    defaultPendingComponent: PageLoader,
  });
}

export type RouterInstance = ReturnType<typeof createRouter<typeof routeTree>>;

declare module "@tanstack/react-router" {
  interface Register {
    router: RouterInstance;
  }
}
