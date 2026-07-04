import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "../features/auth/auth-pages.js";

export const Route = createFileRoute("/login")({ component: LoginPage });
