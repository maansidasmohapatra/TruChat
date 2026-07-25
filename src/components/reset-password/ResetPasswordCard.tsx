import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import {
  isExpiredOrInvalidTokenError,
  resetPasswordWithToken,
  verifyResetToken,
} from '../../lib/auth/passwordReset'
import { isFirebaseConfigured } from '../../lib/firebase'
import {
  validatePassword,
} from '../../lib/auth/passwordValidation'
import { AuthCard } from '../ui/AuthCard'
import { PasswordInput } from '../ui/PasswordInput'
import { PrimaryButton } from '../ui/PrimaryButton'

type ResetView = 'loading' | 'form' | 'success' | 'expired'

function getResetCode(searchParams: URLSearchParams): string | null {
  return searchParams.get('oobCode') || searchParams.get('token')
}

export function ResetPasswordCard() {
  const [searchParams] = useSearchParams()
  const resetCode = getResetCode(searchParams)

  const [view, setView] = useState<ResetView>('loading')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState({ password: false, confirm: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const passwordValidation = useMemo(
    () => validatePassword(newPassword),
    [newPassword],
  )

  const confirmErrors = useMemo(() => {
    if (!confirmPassword) return []
    if (confirmPassword !== newPassword) {
      return ['Passwords do not match.']
    }
    return []
  }, [confirmPassword, newPassword])

  const isFormValid =
    passwordValidation.isValid &&
    confirmPassword.length > 0 &&
    confirmPassword === newPassword

  useEffect(() => {
    async function verifyToken() {
      if (!resetCode) {
        setView('expired')
        return
      }

      if (!isFirebaseConfigured()) {
        setSubmitError(
          'Firebase is not configured. Add your credentials to a .env file (see .env.example).',
        )
        setView('expired')
        return
      }

      try {
        await verifyResetToken(resetCode)
        setView('form')
      } catch (error) {
        if (isExpiredOrInvalidTokenError(error)) {
          setView('expired')
        } else {
          setSubmitError(
            error instanceof Error
              ? error.message
              : 'Unable to verify reset link.',
          )
          setView('expired')
        }
      }
    }

    verifyToken()
  }, [resetCode])

  const handleReset = async () => {
    if (!resetCode || !isFormValid || isSubmitting) return

    setTouched({ password: true, confirm: true })
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await resetPasswordWithToken(resetCode, newPassword)
      setView('success')
    } catch (error) {
      if (isExpiredOrInvalidTokenError(error)) {
        setView('expired')
      } else {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Unable to reset password. Please try again.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (view === 'loading') {
    return (
      <AuthCard
        edition="Correspondence Desk"
        title="Verifying Reset Link"
        subtitle="Please wait while we confirm your password reset request."
        showTerms={false}
      >
        <p className="text-center font-body text-sm text-muted">
          Verifying your secure link...
        </p>
      </AuthCard>
    )
  }

  if (view === 'expired') {
    return (
      <AuthCard
        edition="Correspondence Desk"
        title="Reset Link Expired"
        subtitle="This password reset link is invalid or has expired. Please request a new password reset email."
        showTerms={false}
      >
        <div className="space-y-4">
          {submitError && (
            <p className="font-body text-xs text-accent">{submitError}</p>
          )}

          <PrimaryButton to="/forgot-password">Request New Reset Link</PrimaryButton>
        </div>
      </AuthCard>
    )
  }

  if (view === 'success') {
    return (
      <AuthCard
        edition="Correspondence Desk"
        title="Password Updated"
        subtitle="Your password has been updated successfully."
        showTerms={false}
      >
        <PrimaryButton to="/login">Return to Login</PrimaryButton>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      edition="Correspondence Desk"
      title="Create a New Password"
      subtitle="Enter a new password for your TruChat account."
      showTerms={false}
    >
      <div className="space-y-4">
        <PasswordInput
          id="new-password"
          label="New Password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value)
            setTouched((current) => ({ ...current, password: true }))
          }}
          icon={Lock}
          autoComplete="new-password"
          errors={passwordValidation.errors}
          showErrors={touched.password && newPassword.length > 0}
        />

        <PasswordInput
          id="confirm-password"
          label="Confirm Password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value)
            setTouched((current) => ({ ...current, confirm: true }))
          }}
          icon={Lock}
          autoComplete="new-password"
          errors={confirmErrors}
          showErrors={touched.confirm && confirmPassword.length > 0}
        />

        {submitError && (
          <p className="font-body text-xs text-accent">{submitError}</p>
        )}

        <PrimaryButton
          onClick={handleReset}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </PrimaryButton>
      </div>
    </AuthCard>
  )
}
