export type CabinClass = "economy" | "premium-economy" | "business" | "first";

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAirport: string;
  preferredCabin: CabinClass;
  notifications: {
    priceAlerts: boolean;
    tripReminders: boolean;
    marketingEmails: boolean;
  };
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  homeAirport?: string;
}

export const defaultProfileSettings: ProfileSettings = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  homeAirport: "",
  preferredCabin: "economy",
  notifications: {
    priceAlerts: true,
    tripReminders: true,
    marketingEmails: false,
  },
};

export const cabinClassOptions: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium-economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];
