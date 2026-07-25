import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'
import { AuthCard } from '../ui/AuthCard'
import { AuthInput } from '../ui/AuthInput'
import { GoogleButton } from '../ui/GoogleButton'
import { NewspaperDivider } from '../ui/NewspaperDivider'
import { PrimaryButton } from '../ui/PrimaryButton'

export function SignUpCard() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isFormValid = useMemo(() => {
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    return (
      trimmedUsername.length > 0 &&
      emailValid &&
      password.length >= 6 &&
      password === confirmPassword
    )
  }, [username, email, password, confirmPassword])

  const handleGoogleSignUp = () => {
    console.log('Google sign up')
  }

  const handleCreateAccount = () => {
    if (!isFormValid) return
    console.log('Create account:', { username, email, password })
  }

  return (
    <AuthCard
      edition="New Subscription"
      title="Join the Press"
      subtitle="Create your reader account to begin."
      footer={
        <p className="font-body text-sm text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Log In
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <GoogleButton onClick={handleGoogleSignUp} />

        <NewspaperDivider label="Or" />

        <div className="space-y-4">
          <AuthInput
            id="signup-username"
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={setUsername}
            icon={User}
            autoComplete="username"
          />

          <AuthInput
            id="signup-email"
            label="Email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={setEmail}
            icon={Mail}
            autoComplete="email"
          />

          <AuthInput
            id="signup-password"
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
            icon={Lock}
            autoComplete="new-password"
          />

          <AuthInput
            id="signup-confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            icon={Lock}
            autoComplete="new-password"
          />

          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="font-body text-xs text-accent">
              Passwords do not match.
            </p>
          )}

          <PrimaryButton onClick={handleCreateAccount} disabled={!isFormValid}>
            Create Account
          </PrimaryButton>
        </div>
      </div>
    </AuthCard>
  )
}
