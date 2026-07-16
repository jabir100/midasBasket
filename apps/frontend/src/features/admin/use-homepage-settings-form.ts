import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toast } from "@heroui/react";

import {
  getHomepageSettings,
  updateHomepageSettings,
  type HomepageSettings,
} from "./admin-api.js";
import { defaultHomepageForm } from "./admin-types.js";

function normalizeHomepageSettings(input: HomepageSettings): HomepageSettings {
  const whyChooseUs =
    input.whyChooseUs ?? defaultHomepageForm.whyChooseUs ?? [];
  const popularProductIds =
    input.popularProductIds ?? defaultHomepageForm.popularProductIds ?? [];
  const bestSellingProductIds =
    input.bestSellingProductIds ??
    defaultHomepageForm.bestSellingProductIds ??
    [];

  return {
    whyChooseUs,
    popularProductIds,
    bestSellingProductIds,
  };
}

export function useHomepageSettingsForm(): {
  homepageForm: HomepageSettings;
  setHomepageForm: (form: HomepageSettings) => void;
  isLoading: boolean;
  updateHomepageMutation: {
    isPending: boolean;
    error: Error | null;
    mutate: (input: HomepageSettings) => void;
  };
} {
  const queryClient = useQueryClient();
  const [homepageForm, setHomepageForm] =
    useState<HomepageSettings>(defaultHomepageForm);

  const homepageSettingsQuery = useQuery({
    queryKey: ["admin", "homepage", "settings"],
    queryFn: getHomepageSettings,
  });

  useEffect(() => {
    if (homepageSettingsQuery.data) {
      setHomepageForm(normalizeHomepageSettings(homepageSettingsQuery.data));
    }
  }, [homepageSettingsQuery.data]);

  const updateHomepageMutation = useMutation({
    mutationFn: (input: HomepageSettings) =>
      updateHomepageSettings(normalizeHomepageSettings(input)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "homepage", "settings"],
      });
      await queryClient.invalidateQueries({ queryKey: ["homepage"] });
      Toast.toast.success("Homepage settings saved");
    },
  });

  return {
    homepageForm,
    setHomepageForm,
    isLoading: homepageSettingsQuery.isLoading,
    updateHomepageMutation,
  };
}
