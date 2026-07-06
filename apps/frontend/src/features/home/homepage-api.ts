import { apiClient } from "../../shared/http/api-client.js";
import type { HomepagePayload } from "./homepage.types.js";

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export async function fetchHomepage(): Promise<HomepagePayload> {
  const response =
    await apiClient.get<ApiSuccess<HomepagePayload>>("/homepage");
  return response.data.data;
}
