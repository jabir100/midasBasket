import { createFileRoute } from "@tanstack/react-router";

import { BrandsPage } from "../features/catalog/catalog-pages.js";

export const Route = createFileRoute("/brands")({ component: BrandsPage });
