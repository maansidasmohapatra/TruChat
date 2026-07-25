import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import {
  sendPasswordResetLink,
  shouldMaskEmailNotFound,
} from '../../lib/auth/passwordReset'
import { isFirebaseConfigured } from '../../lib/firebase'
import { validateEmail } from '../../lib/auth/passwordValidation'
import { AuthCard } from '../ui/AuthCard'
import { AuthInput } from '../ui/AuthInput'
import { PrimaryButton } from '../ui/PrimaryButton'

export function ForgotPasswordCard() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const emailValid = validateEmail(email)

  const handleSubmit = async () => {
    if (!emailValid || isSubmitting) return

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (!isFirebaseConfigured()) {
        throw new Error(
          'Firebase is not configured. Add your credentials to a .env file (see .env.example).',
        )
      }

      await sendPasswordResetLink(email)
    } catch (error) {
      if (shouldMaskEmailNotFound(error)) {
        // Always show success to prevent email enumeration.
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to send reset link. Please try again.',
        )
        setIsSubmitting(false)
        return
      }
    }

    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <AuthCard
      edition="Correspondence Desk"
      title="Forgot Your Password?"
      subtitle="Enter the email address associated with your TruChat account. We'll send you a secure password reset link."
      showTerms={false}
      footer={
        <p className="font-body text-sm text-muted">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Log In
          </Link>
        </p>
      }
    >
      {submitted ? (
        <div className="space-y-4 text-center">
          <p className="font-body text-sm leading-relaxed text-ink">
            If an account with that email exists, we&apos;ve sent a password reset
            link.
          </p>

          <Link
            to="/login"
            className="inline-block font-editorial text-sm text-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            Return to Log In
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AuthInput
            id="forgot-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={setEmail}
            icon={Mail}
            autoComplete="email"
          />

          {errorMessage && (
            <p className="font-body text-xs text-accent">{errorMessage}</p>
          )}

          <PrimaryButton
            onClick={handleSubmit}
            disabled={!emailValid || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Password Reset Link'}
          </PrimaryButton>
        </div>
      )}
    </AuthCard>
  )
}
