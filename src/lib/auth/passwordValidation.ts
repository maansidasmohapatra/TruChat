export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters.')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Must include at least one uppercase letter.')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Must include at least one lowercase letter.')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Must include at least one number.')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Must include at least one special character.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
