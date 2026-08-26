import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth/data";
import { getProfile } from "@/features/user/data";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Edit profile",
};

export default async function ProfileSettingsPage() {
  const viewer = await getCurrentUser();
  // Until sessions exist the fixture user stands in for "logged in";
  // once it does, guests are redirected from here naturally.
  const profile = viewer ? await getProfile(viewer.username, viewer.username) : null;

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Log in to edit your profile.</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Edit profile" description="How you appear across Vesper." />
      <ProfileSettingsForm profile={profile} />
    </div>
  );
}
