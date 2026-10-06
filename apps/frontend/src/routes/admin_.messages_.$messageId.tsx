import { createFileRoute } from "@tanstack/react-router";

import { AdminMessageDetailsPage } from "../features/admin/message-details-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/messages_/$messageId")({
  head: () => ({
    meta: [{ title: "Message | Midas Basket Admin" }, noIndexMeta],
  }),
  component: MessageDetailsRoute,
});

function MessageDetailsRoute() {
  const { messageId } = Route.useParams();
  return <AdminMessageDetailsPage messageId={messageId} />;
}
