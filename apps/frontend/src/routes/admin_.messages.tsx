import { createFileRoute } from "@tanstack/react-router";

import { AdminMessagesPage } from "../features/admin/messages-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/messages")({
  head: () => ({
    meta: [{ title: "Messages | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminMessagesPage,
});
