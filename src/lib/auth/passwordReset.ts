import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase'

function getResetPasswordUrl(): string {
  return `${window.location.origin}/reset-password`
}

export async function sendPasswordResetLink(email: string): Promise<void> {
  const auth = getFirebaseAuth()

  await sendPasswordResetEmail(auth, email.trim(), {
    url: getResetPasswordUrl(),
    handleCodeInApp: true,
  })
}

export async function verifyResetToken(resetCode: string): Promise<string> {
  const auth = getFirebaseAuth()
  return verifyPasswordResetCode(auth, resetCode)
}

export async function resetPasswordWithToken(
  resetCode: string,
  newPassword: string,
): Promise<void> {
  const auth = getFirebaseAuth()
  await confirmPasswordReset(auth, resetCode, newPassword)
}

export function isExpiredOrInvalidTokenError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false
  }

  const code = (error as { code: string }).code
  return (
    code === 'auth/expired-action-code' ||
    code === 'auth/invalid-action-code' ||
    code === 'auth/user-disabled'
  )
}

export function shouldMaskEmailNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false
  }

  const code = (error as { code: string }).code
  return code === 'auth/user-not-found'
}
