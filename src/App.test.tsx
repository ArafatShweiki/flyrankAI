import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Profile settings form', () => {
  it('applies the selected Light theme immediately', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeSelect = screen.getByLabelText(/theme/i);

    await user.selectOptions(themeSelect, 'Light');

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('applies the selected Dark theme immediately', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeSelect = screen.getByLabelText(/theme/i);

    await user.selectOptions(themeSelect, 'Dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('uses the operating system preference when System is selected', async () => {
    const user = userEvent.setup();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        ...mediaQuery,
        matches: true,
        media: query,
        addEventListener,
        removeEventListener,
      }),
    });

    render(<App />);

    const themeSelect = screen.getByLabelText(/theme/i);
    await user.selectOptions(themeSelect, 'System');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('shows errors for empty names', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
  });

  it('shows an error for invalid email', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
  });

  it('rejects invalid airport codes AB and 123', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'AB');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/home airport must be exactly 3 letters/i)).toBeInTheDocument();

    await user.clear(screen.getByRole('textbox', { name: /home airport/i }));
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), '123');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/home airport must be exactly 3 letters/i)).toBeInTheDocument();
  });

  it('normalizes a lowercase airport code when saving', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'jfk');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByDisplayValue('JFK')).toBeInTheDocument();
    expect(screen.getByText(/profile settings saved successfully/i)).toBeInTheDocument();
  });

  it('accepts an empty optional phone number', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'jfk');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
    expect(screen.getByText(/profile settings saved successfully/i)).toBeInTheDocument();
  });

  it('requires a phone number when SMS notifications are enabled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'jfk');
    await user.click(screen.getByLabelText(/sms notifications/i));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/phone number is required when sms notifications are enabled/i)).toBeInTheDocument();
  });

  it('shows a success message after a valid submission', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /phone number/i }), '+1 (555) 123-4567');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'jfk');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/profile settings saved successfully/i)).toBeInTheDocument();
  });

  it('resets the form to its initial values and clears messages', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Lovelace');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'ada@example.com');
    await user.type(screen.getByRole('textbox', { name: /home airport/i }), 'jfk');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText(/profile settings saved successfully/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /last name/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('');
    expect(screen.queryByText(/profile settings saved successfully/i)).not.toBeInTheDocument();
  });

  it('uses accessible labels and aria attributes on invalid fields', async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstNameField = screen.getByRole('textbox', { name: /first name/i });
    const emailField = screen.getByRole('textbox', { name: /email/i });

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(firstNameField).toHaveAttribute('aria-invalid', 'true');
    expect(emailField).toHaveAttribute('aria-invalid', 'true');
    expect(emailField).toHaveAttribute('aria-describedby');
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    const section = screen.getByRole('group', { name: /personal information/i });
    expect(within(section).getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
  });
});
