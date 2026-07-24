import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { defaultProfileSettings, type ProfileSettings } from "@/types/profile";

const sampleProfile: ProfileSettings = {
  ...defaultProfileSettings,
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 234-5678",
  homeAirport: "JFK",
  preferredCabin: "premium-economy",
};

async function handleProfileSubmit(values: ProfileSettings) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Profile saved:", values);
}

export function ProfileSettingsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              FlyRank AI
            </p>
            <h1 className="text-xl font-semibold text-slate-900">Profile settings</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ProfileSettingsForm
          initialValues={sampleProfile}
          onSubmit={handleProfileSubmit}
        />
      </main>
    </div>
  );
}
