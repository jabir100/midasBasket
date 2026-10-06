import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../shared/http/api-client.js";

export const socialPlatforms = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "x",
  "linkedin",
  "pinterest",
  "messenger",
  "telegram",
  "website",
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export type ContactDetails = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
};

export type PublicSocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  label: string;
};

export type SiteContact = {
  details: ContactDetails;
  socialLinks: PublicSocialLink[];
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export const siteContactQueryKey = ["site-contact"] as const;

export async function fetchSiteContact(): Promise<SiteContact> {
  const response = await apiClient.get<ApiSuccess<SiteContact>>("/contact");
  return response.data.data;
}

export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<void> {
  await apiClient.post("/contact/messages", input);
}

/** Public contact channels + social links, shared by the footer and contact page. */
export function useSiteContact(initialData?: SiteContact | null) {
  return useQuery({
    queryKey: siteContactQueryKey,
    queryFn: fetchSiteContact,
    staleTime: 5 * 60 * 1000,
    ...(initialData ? { initialData } : {}),
  });
}
