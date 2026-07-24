import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ id, label, error, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

export function TextInput({ id, error, className = "", ...props }: TextInputProps) {
  return (
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
        error
          ? "border-red-300 focus:border-red-500"
          : "border-slate-300 focus:border-brand-500"
      } ${className}`}
      {...props}
    />
  );
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  error?: string;
}

export function SelectInput({ id, error, className = "", children, ...props }: SelectInputProps) {
  return (
    <select
      id={id}
      aria-invalid={Boolean(error)}
      className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
        error
          ? "border-red-300 focus:border-red-500"
          : "border-slate-300 focus:border-brand-500"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-800">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
          checked ? "bg-brand-600" : "bg-slate-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
