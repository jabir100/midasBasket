import { MapPin, Trash2 } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { Input, Skeleton } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { Button } from "../../shared/ui/button.js";
import { AdminField } from "../admin/admin-form-controls.js";
import type { UserAddress } from "./dashboard-api.js";

export type AddressForm = {
  label: string;
  line1: string;
  area: string;
  city: string;
  country: string;
};

export function AddressesPanel({
  addressForm,
  addresses,
  isCreating,
  isDeleting,
  isLoading,
  onAddressFieldChange,
  onCreateAddress,
  onDeleteAddress,
}: Readonly<{
  addressForm: AddressForm;
  addresses: UserAddress[];
  isCreating: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  onAddressFieldChange: (field: keyof AddressForm, value: string) => void;
  onCreateAddress: () => void;
  onDeleteAddress: (addressId: string) => void;
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <h3>Saved Addresses</h3>
        <p>Manage your delivery and billing locations for faster checkout.</p>
      </div>

      <div className="dashboard-grid-two" style={{ marginTop: "1.5rem" }}>
        <Card className="dashboard-card">
          <CardBody>
            <h2>Add New Address</h2>
            <form
              className="admin-modern-form"
              onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
                event.preventDefault();
                onCreateAddress();
              }}
            >
              <AdminField label="Label">
                <Input
                  required
                  className="admin-heroui-input"
                  value={addressForm.label}
                  onChange={(event) => {
                    onAddressFieldChange("label", event.target.value);
                  }}
                />
              </AdminField>
              <AdminField label="Address line">
                <Input
                  required
                  className="admin-heroui-input"
                  value={addressForm.line1}
                  onChange={(event) => {
                    onAddressFieldChange("line1", event.target.value);
                  }}
                />
              </AdminField>
              <AdminField label="Area">
                <Input
                  required
                  className="admin-heroui-input"
                  value={addressForm.area}
                  onChange={(event) => {
                    onAddressFieldChange("area", event.target.value);
                  }}
                />
              </AdminField>
              <AdminField label="City">
                <Input
                  required
                  className="admin-heroui-input"
                  value={addressForm.city}
                  onChange={(event) => {
                    onAddressFieldChange("city", event.target.value);
                  }}
                />
              </AdminField>
              <AdminField label="Country">
                <Input
                  required
                  className="admin-heroui-input"
                  value={addressForm.country}
                  onChange={(event) => {
                    onAddressFieldChange("country", event.target.value);
                  }}
                />
              </AdminField>
              <div className="admin-form-actions">
                <Button type="submit" tone="primary" disabled={isCreating}>
                  Add address
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <h2>Address List</h2>
            {isLoading ? (
              <div className="admin-skeleton-stack">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ) : null}

            {!isLoading && addresses.length > 0 ? (
              <ul className="dashboard-address-list">
                {addresses.map((address) => (
                  <li key={address.id}>
                    <div>
                      <strong>{address.label}</strong>
                      <small>
                        {address.line1}, {address.area}, {address.city},{" "}
                        {address.country}
                      </small>
                    </div>
                    <Button
                      iconOnly
                      tone="ghost"
                      title="Remove address"
                      onClick={() => {
                        onDeleteAddress(address.id);
                      }}
                      disabled={isDeleting}
                      startContent={
                        <Trash2
                          size={16}
                          style={{ color: "var(--color-midas-red)" }}
                        />
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}

            {!isLoading && addresses.length === 0 ? (
              <div className="admin-empty-state">
                <MapPin size={28} />
                <p style={{ margin: 0 }}>No addresses saved yet.</p>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
