import { FormEvent, useEffect, useMemo, useState } from 'react';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timeZone: string;
  homeAirport: string;
  cabinClass: string;
  seatPreference: string;
  travelFrequency: string;
  currency: string;
  accessibilityAssistance: boolean;
  priceDropAlerts: boolean;
  tripReminders: boolean;
  productUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  theme: string;
  compactLayout: boolean;
};

type FormErrors = Partial<Record<keyof FormState | 'form', string>>;

const initialFormData: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  language: 'English',
  timeZone: 'UTC',
  homeAirport: '',
  cabinClass: 'Economy',
  seatPreference: 'No preference',
  travelFrequency: 'Occasionally',
  currency: 'USD',
  accessibilityAssistance: false,
  priceDropAlerts: true,
  tripReminders: true,
  productUpdates: false,
  emailNotifications: true,
  smsNotifications: false,
  theme: 'System',
  compactLayout: false,
};

const phonePattern = /^[0-9+()\-\s]*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const airportPattern = /^[A-Za-z]{3}$/;

const isError = (errors: FormErrors, key: keyof FormState) => Boolean(errors[key]);

const resolveTheme = (themeName: string) => {
  if (themeName === 'Light') {
    return 'light';
  }

  if (themeName === 'Dark') {
    return 'dark';
  }

  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const currentTheme = useMemo(() => resolveTheme(formData.theme), [formData.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      root.dataset.theme = resolveTheme(formData.theme);
      root.style.colorScheme = resolveTheme(formData.theme);
    };

    applyTheme();

    if (formData.theme === 'System') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }

    return undefined;
  }, [formData.theme]);

  const currentErrorIds = useMemo(
    () => ({
      firstName: isError(errors, 'firstName') ? 'firstName-error' : undefined,
      lastName: isError(errors, 'lastName') ? 'lastName-error' : undefined,
      email: isError(errors, 'email') ? 'email-error' : undefined,
      phone: isError(errors, 'phone') ? 'phone-error' : undefined,
      homeAirport: isError(errors, 'homeAirport') ? 'homeAirport-error' : undefined,
      smsNotifications: isError(errors, 'smsNotifications') ? 'smsNotifications-error' : undefined,
    }),
    [errors],
  );

  const validateForm = (candidate: FormState): FormErrors => {
    const nextErrors: FormErrors = {};

    const firstName = candidate.firstName.trim();
    const lastName = candidate.lastName.trim();
    const email = candidate.email.trim();
    const phone = candidate.phone.trim();
    const homeAirport = candidate.homeAirport.trim();

    if (!firstName) {
      nextErrors.firstName = 'First name is required.';
    }

    if (!lastName) {
      nextErrors.lastName = 'Last name is required.';
    }

    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (candidate.phone && !phonePattern.test(candidate.phone)) {
      nextErrors.phone = 'Phone number may only include numbers, spaces, parentheses, +, and -.';
    }

    if (!airportPattern.test(homeAirport)) {
      nextErrors.homeAirport = 'Home airport must be exactly 3 letters.';
    }

    if (candidate.smsNotifications && !phone) {
      nextErrors.smsNotifications = 'Phone number is required when SMS notifications are enabled.';
    }

    return nextErrors;
  };

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9+()\-\s]/g, '');
    updateField('phone', sanitizedValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('');
      return;
    }

    const sanitizedAirport = formData.homeAirport.trim().toUpperCase();

    setFormData((previous) => ({
      ...previous,
      homeAirport: sanitizedAirport,
    }));
    setErrors({});
    setSuccessMessage('Profile settings saved successfully');
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSuccessMessage('');
  };

  const checkboxFields = [
    { key: 'accessibilityAssistance', label: 'Accessibility assistance' },
    { key: 'compactLayout', label: 'Compact layout' },
    { key: 'priceDropAlerts', label: 'Price drop alerts' },
    { key: 'tripReminders', label: 'Trip reminders' },
    { key: 'productUpdates', label: 'Product updates' },
    { key: 'emailNotifications', label: 'Email notifications' },
    { key: 'smsNotifications', label: 'SMS notifications' },
  ] as const;

  return (
    <main className="page-shell" data-theme={currentTheme}>
      <section className="form-card" aria-labelledby="profile-settings-heading">
        <div className="form-header">
          <p className="eyebrow">FlyRank AI</p>
          <h1 id="profile-settings-heading">Profile settings</h1>
          <p className="subcopy">Manage your personal travel and notification preferences.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="field-group">
            <legend>Personal information</legend>
            <div className="input-grid">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={currentErrorIds.firstName}
                />
                {errors.firstName ? <span id="firstName-error" className="error-message">{errors.firstName}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={currentErrorIds.lastName}
                />
                {errors.lastName ? <span id="lastName-error" className="error-message">{errors.lastName}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={currentErrorIds.email}
                />
                {errors.email ? <span id="email-error" className="error-message">{errors.email}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="phone">Optional phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={currentErrorIds.phone}
                />
                {errors.phone ? <span id="phone-error" className="error-message">{errors.phone}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="language">Preferred language</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={(event) => updateField('language', event.target.value)}
                >
                  <option>English</option>
                  <option>Arabic</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="timeZone">Time zone</label>
                <input
                  id="timeZone"
                  name="timeZone"
                  type="text"
                  value={formData.timeZone}
                  onChange={(event) => updateField('timeZone', event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Travel preferences</legend>
            <div className="input-grid">
              <div className="field">
                <label htmlFor="homeAirport">Home airport</label>
                <input
                  id="homeAirport"
                  name="homeAirport"
                  type="text"
                  value={formData.homeAirport}
                  onChange={(event) => updateField('homeAirport', event.target.value)}
                  aria-invalid={Boolean(errors.homeAirport)}
                  aria-describedby={currentErrorIds.homeAirport}
                />
                {errors.homeAirport ? <span id="homeAirport-error" className="error-message">{errors.homeAirport}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="cabinClass">Cabin class</label>
                <select
                  id="cabinClass"
                  name="cabinClass"
                  value={formData.cabinClass}
                  onChange={(event) => updateField('cabinClass', event.target.value)}
                >
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="seatPreference">Seat preference</label>
                <select
                  id="seatPreference"
                  name="seatPreference"
                  value={formData.seatPreference}
                  onChange={(event) => updateField('seatPreference', event.target.value)}
                >
                  <option>Window</option>
                  <option>Aisle</option>
                  <option>No preference</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="travelFrequency">Travel frequency</label>
                <select
                  id="travelFrequency"
                  name="travelFrequency"
                  value={formData.travelFrequency}
                  onChange={(event) => updateField('travelFrequency', event.target.value)}
                >
                  <option>Rarely</option>
                  <option>Occasionally</option>
                  <option>Frequently</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="currency">Preferred currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={(event) => updateField('currency', event.target.value)}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>ILS</option>
                </select>
              </div>

              <div className="field checkbox-row">
                <label htmlFor="accessibilityAssistance">
                  <input
                    id="accessibilityAssistance"
                    name="accessibilityAssistance"
                    type="checkbox"
                    checked={formData.accessibilityAssistance}
                    onChange={(event) => updateField('accessibilityAssistance', event.target.checked)}
                  />
                  <span>Accessibility assistance</span>
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Notifications</legend>
            <div className="checkbox-grid">
              {checkboxFields.filter((field) => field.key !== 'accessibilityAssistance' && field.key !== 'compactLayout').map((field) => (
                <label key={field.key} htmlFor={field.key} className="checkbox-row">
                  <input
                    id={field.key}
                    name={field.key}
                    type="checkbox"
                    checked={formData[field.key]}
                    onChange={(event) => updateField(field.key, event.target.checked)}
                    aria-invalid={field.key === 'smsNotifications' && Boolean(errors.smsNotifications)}
                    aria-describedby={field.key === 'smsNotifications' ? currentErrorIds.smsNotifications : undefined}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
            {errors.smsNotifications ? <span id="smsNotifications-error" className="error-message">{errors.smsNotifications}</span> : null}
          </fieldset>

          <fieldset className="field-group">
            <legend>Appearance</legend>
            <div className="input-grid">
              <div className="field">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={(event) => updateField('theme', event.target.value)}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>

              <div className="field checkbox-row">
                <label htmlFor="compactLayout">
                  <input
                    id="compactLayout"
                    name="compactLayout"
                    type="checkbox"
                    checked={formData.compactLayout}
                    onChange={(event) => updateField('compactLayout', event.target.checked)}
                  />
                  <span>Compact layout</span>
                </label>
              </div>
            </div>
          </fieldset>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="primary-button">
              Save changes
            </button>
          </div>

          {successMessage ? (
            <p className="success-message" role="status" aria-live="polite">
              {successMessage}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}

export default App;
