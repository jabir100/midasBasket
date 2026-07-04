import { createFileRoute } from "@tanstack/react-router";

import { AccountPage } from "../features/auth/auth-pages.js";

export const Route = createFileRoute("/account")({ component: AccountPage });
