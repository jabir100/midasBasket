import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import {
  getDashboardProfile,
  getNotificationPreferences,
  updateDashboardProfile,
  updateNotificationPreferences,
} from "./dashboard-api.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";
import { ProfilePanel } from "./profile-panel.js";

export function DashboardProfilePage(): ReactNode {
  const queryClient = useQueryClient();
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: getDashboardProfile,
  });
  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: getNotificationPreferences,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateDashboardProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
      Toast.toast.success("Profile updated");
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      });
      Toast.toast.success("Notification preferences updated");
    },
  });

  return (
    <DashboardPageShell>
      <ProfilePanel
        profile={profileQuery.data}
        onProfileFieldChange={(field, value) => {
          setProfileForm((current) => ({ ...current, [field]: value }));
        }}
        onProfileSubmit={() => {
          const payload = {
            ...(profileForm.name ? { name: profileForm.name } : {}),
            ...(profileForm.phone ? { phone: profileForm.phone } : {}),
          };
          if (Object.keys(payload).length === 0) {
            return;
          }
          updateProfileMutation.mutate(payload);
        }}
        isSavingProfile={updateProfileMutation.isPending}
        profileError={updateProfileMutation.error?.message ?? null}
        notifications={notificationsQuery.data}
        onNotificationChange={(key, value) => {
          updateNotificationsMutation.mutate({ [key]: value });
        }}
        isSavingNotifications={updateNotificationsMutation.isPending}
        notificationsError={updateNotificationsMutation.error?.message ?? null}
      />
    </DashboardPageShell>
  );
}
