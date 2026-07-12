import { Bell } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { Input } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import { AdminField, AdminSwitch } from "../admin/admin-form-controls.js";
import type {
  DashboardProfile,
  NotificationPreferences,
} from "./dashboard-api.js";

function toPreferenceLabel(value: string): string {
  return value
    .replaceAll(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

export function ProfilePanel({
  isSavingNotifications,
  isSavingProfile,
  notifications,
  notificationsError,
  onNotificationChange,
  onProfileFieldChange,
  onProfileSubmit,
  profile,
  profileError,
}: Readonly<{
  isSavingNotifications: boolean;
  isSavingProfile: boolean;
  notifications: NotificationPreferences | undefined;
  notificationsError: string | null;
  onNotificationChange: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => void;
  onProfileFieldChange: (field: "name" | "phone", value: string) => void;
  onProfileSubmit: () => void;
  profile: DashboardProfile | undefined;
  profileError: string | null;
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <h3>Profile & Settings</h3>
        <p>Update your personal information and communication preferences.</p>
      </div>

      <div className="dashboard-grid-two" style={{ marginTop: "1.5rem" }}>
        <Card className="dashboard-card">
          <CardBody>
            <h2>Personal Information</h2>
            <form
              className="admin-modern-form"
              onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
                event.preventDefault();
                onProfileSubmit();
              }}
            >
              <AdminField label="Name">
                <Input
                  className="admin-heroui-input"
                  defaultValue={profile?.user.name}
                  onChange={(event) => {
                    onProfileFieldChange("name", event.target.value);
                  }}
                />
              </AdminField>
              <AdminField label="Phone">
                <Input
                  className="admin-heroui-input"
                  defaultValue={profile?.user.phone ?? ""}
                  onChange={(event) => {
                    onProfileFieldChange("phone", event.target.value);
                  }}
                />
              </AdminField>
              <div className="admin-form-actions">
                <Button
                  type="submit"
                  tone="primary"
                  disabled={isSavingProfile}
                >
                  Save profile
                </Button>
              </div>
              {profileError ? <p className="form-error">{profileError}</p> : null}
            </form>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <h2>Notification Settings</h2>
            {notifications ? (
              <div className="dashboard-preferences">
                {Object.entries(notifications).map(([key, value]) => (
                  <AdminSwitch
                    key={key}
                    isSelected={value}
                    onChange={(isSelected) => {
                      onNotificationChange(
                        key as keyof NotificationPreferences,
                        isSelected,
                      );
                    }}
                  >
                    {toPreferenceLabel(key)}
                  </AdminSwitch>
                ))}
              </div>
            ) : (
              <p className="form-muted">Loading preferences...</p>
            )}
            {isSavingNotifications ? (
              <p className="form-muted">Saving preferences...</p>
            ) : null}
            {notificationsError ? (
              <p className="form-error">{notificationsError}</p>
            ) : null}
            <p className="dashboard-helper-row">
              <Bell size={16} /> Transaction notifications stay enabled by
              default.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
