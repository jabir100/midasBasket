import { createFileRoute } from "@tanstack/react-router";

import { RegisterPage } from "../features/auth/auth-pages.js";

export const Route = createFileRoute("/register")({ component: RegisterPage });
