import type { ProfileFormErrors, ProfileSettings } from "@/types/profile";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;
const AIRPORT_PATTERN = /^[A-Z]{3}$/;

export function validateProfileSettings(
  values: ProfileSettings,
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (
    values.homeAirport.trim() &&
    !AIRPORT_PATTERN.test(values.homeAirport.trim().toUpperCase())
  ) {
    errors.homeAirport = "Use a 3-letter IATA airport code (e.g. JFK).";
  }

  return errors;
}

export function hasValidationErrors(errors: ProfileFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
