import { useState, type FormEvent } from "react";
import { FormField, SelectInput, TextInput, Toggle } from "@/components/FormField";
import {
  cabinClassOptions,
  defaultProfileSettings,
  type ProfileFormErrors,
  type ProfileSettings,
} from "@/types/profile";
import { hasValidationErrors, validateProfileSettings } from "@/utils/validateProfile";

interface ProfileSettingsFormProps {
  initialValues?: ProfileSettings;
  onSubmit?: (values: ProfileSettings) => Promise<void> | void;
}

export function ProfileSettingsForm({
  initialValues = defaultProfileSettings,
  onSubmit,
}: ProfileSettingsFormProps) {
  const [values, setValues] = useState<ProfileSettings>(initialValues);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const updateField = <K extends keyof ProfileSettings>(
    field: K,
    value: ProfileSettings[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  };

  const updateNotification = (
    field: keyof ProfileSettings["notifications"],
    checked: boolean,
  ) => {
    setValues((current) => ({
      ...current,
      notifications: { ...current.notifications, [field]: checked },
    }));
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateProfileSettings(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    setStatus("saving");

    try {
      await onSubmit?.(values);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const initials = `${values.firstName.charAt(0)}${values.lastName.charAt(0)}`.toUpperCase();

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700"
          >
            {initials.trim() || "FR"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
            <p className="text-sm text-slate-500">
              Update your personal details and travel preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="firstName" label="First name" error={errors.firstName}>
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              error={errors.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
          </FormField>

          <FormField id="lastName" label="Last name" error={errors.lastName}>
            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              error={errors.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
          </FormField>

          <FormField id="email" label="Email address" error={errors.email}>
            <TextInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </FormField>

          <FormField
            id="phone"
            label="Phone number"
            error={errors.phone}
            hint="Optional — used for trip reminders."
          >
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              value={values.phone}
              error={errors.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Travel preferences</h2>
          <p className="mt-1 text-sm text-slate-500">
            Help FlyRank AI personalize flight recommendations for you.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="homeAirport"
            label="Home airport"
            error={errors.homeAirport}
            hint="3-letter IATA code, e.g. LAX or LHR."
          >
            <TextInput
              id="homeAirport"
              name="homeAirport"
              type="text"
              maxLength={3}
              placeholder="JFK"
              value={values.homeAirport}
              error={errors.homeAirport}
              onChange={(event) =>
                updateField("homeAirport", event.target.value.toUpperCase())
              }
            />
          </FormField>

          <FormField id="preferredCabin" label="Preferred cabin class">
            <SelectInput
              id="preferredCabin"
              name="preferredCabin"
              value={values.preferredCabin}
              onChange={(event) =>
                updateField("preferredCabin", event.target.value as ProfileSettings["preferredCabin"])
              }
            >
              {cabinClassOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose how you want to hear from FlyRank AI.
          </p>
        </div>

        <div className="space-y-3">
          <Toggle
            id="priceAlerts"
            label="Price drop alerts"
            description="Get notified when fares drop on saved routes."
            checked={values.notifications.priceAlerts}
            onChange={(checked) => updateNotification("priceAlerts", checked)}
          />
          <Toggle
            id="tripReminders"
            label="Trip reminders"
            description="Receive check-in and departure reminders."
            checked={values.notifications.tripReminders}
            onChange={(checked) => updateNotification("tripReminders", checked)}
          />
          <Toggle
            id="marketingEmails"
            label="Product updates"
            description="Occasional emails about new FlyRank AI features."
            checked={values.notifications.marketingEmails}
            onChange={(checked) => updateNotification("marketingEmails", checked)}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p aria-live="polite" className="text-sm">
          {status === "saved" && (
            <span className="text-emerald-600">Profile saved successfully.</span>
          )}
          {status === "error" && (
            <span className="text-red-600">
              Something went wrong. Please try again.
            </span>
          )}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setValues(initialValues);
              setErrors({});
              setStatus("idle");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
