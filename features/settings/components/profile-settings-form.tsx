"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import type { UserProfile } from "@/features/user/types/user";
import {
  profileSchema,
  BIO_MAX_LENGTH,
  type ProfileInput,
} from "@/features/user/schemas/profile";
import { updateProfile } from "@/features/user/data";
import { FormActions, FormField } from "@/features/auth/components/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileSettingsFormProps {
  profile: UserProfile;
}

function initials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [bioLength, setBioLength] = useState(profile.bio?.length ?? 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: standardSchemaResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      bio: profile.bio ?? "",
    },
  });

  const onSubmit = async (values: ProfileInput) => {
    try {
      await updateProfile(values);
      toast.success("Profile updated");
      router.push(`/u/${profile.username}`);
    } catch {
      toast.error("Couldn't save your profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
        <Avatar size="lg">
          {profile.avatarUrl ? (
            <AvatarImage src={profile.avatarUrl} alt="" />
          ) : null}
          <AvatarFallback>{initials(profile.displayName)}</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground">
          Avatar uploads arrive with media storage. Your initials represent you
          for now.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username-readonly">Username</Label>
        <p
          id="username-readonly"
          className="rounded-lg border border-input bg-input/30 px-2.5 py-1.5 text-sm text-muted-foreground"
        >
          @{profile.username}{" "}
          <span className="text-[11px] normal-case">(usernames are permanent)</span>
        </p>
      </div>

      <FormField
        id="displayName"
        label="Display name"
        autoComplete="name"
        registration={register("displayName")}
        error={errors.displayName?.message}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={3}
          maxLength={BIO_MAX_LENGTH}
          placeholder="A sentence or two about your nights."
          aria-invalid={errors.bio ? true : undefined}
          aria-describedby={errors.bio ? "bio-error" : "bio-counter"}
          {...register("bio", {
            onChange: (event) => setBioLength(event.target.value.length),
          })}
        />
        <div className="flex items-center justify-between">
          {errors.bio ? (
            <p id="bio-error" role="alert" className="text-xs text-destructive">
              {errors.bio.message}
            </p>
          ) : (
            <span />
          )}
          <span id="bio-counter" className="text-xs text-muted-foreground">
            {bioLength}/{BIO_MAX_LENGTH}
          </span>
        </div>
      </div>

      <FormActions className="flex-row justify-end pt-0">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </FormActions>
    </form>
  );
}
