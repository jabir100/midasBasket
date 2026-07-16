import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import {
  createUserAddress,
  deleteUserAddress,
  listUserAddresses,
} from "./dashboard-api.js";
import { AddressesPanel, type AddressForm } from "./addresses-panel.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";

export function DashboardAddressesPage(): ReactNode {
  const queryClient = useQueryClient();
  const [addressForm, setAddressForm] = useState<AddressForm>({
    label: "Home",
    line1: "",
    area: "",
    city: "",
    country: "Bangladesh",
  });

  const addressesQuery = useQuery({
    queryKey: ["dashboard", "addresses"],
    queryFn: listUserAddresses,
  });

  const createAddressMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: async () => {
      setAddressForm({
        label: "Home",
        line1: "",
        area: "",
        city: "",
        country: "Bangladesh",
      });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
      Toast.toast.success("Address added");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
      Toast.toast.success("Address deleted");
    },
  });

  return (
    <DashboardPageShell>
      <AddressesPanel
        addressForm={addressForm}
        onAddressFieldChange={(field, value) => {
          setAddressForm((current) => ({ ...current, [field]: value }));
        }}
        onCreateAddress={() => {
          createAddressMutation.mutate(addressForm);
        }}
        addresses={addressesQuery.data ?? []}
        isLoading={addressesQuery.isLoading}
        isCreating={createAddressMutation.isPending}
        isDeleting={deleteAddressMutation.isPending}
        onDeleteAddress={(addressId) => {
          deleteAddressMutation.mutate(addressId);
        }}
      />
    </DashboardPageShell>
  );
}
