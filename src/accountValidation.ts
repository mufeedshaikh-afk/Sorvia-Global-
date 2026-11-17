export type AuthMode = 'signin' | 'register' | 'reset';
export type AuthDraft = { name: string; email: string; password: string; confirm: string };
export type AuthErrors = Partial<Record<keyof AuthDraft, string>>;
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export function validateAuth(mode: AuthMode, draft: AuthDraft): AuthErrors {
  const errors: AuthErrors = {};
  if (!isEmail(draft.email)) errors.email = 'Enter an email address, for example alex@example.com.';
  if (mode === 'register' && !draft.name.trim()) errors.name = 'Enter your name.';
  if (mode !== 'reset' && (draft.password.length < 8 || !draft.password.trim())) errors.password = 'Use at least 8 characters for this preview.';
  if (mode === 'register' && draft.password !== draft.confirm) errors.confirm = 'The passwords do not match.';
  return errors;
}
