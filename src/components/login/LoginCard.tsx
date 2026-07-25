import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { AuthCard } from '../ui/AuthCard'
import { AuthInput } from '../ui/AuthInput'
import { GoogleButton } from '../ui/GoogleButton'
import { NewspaperDivider } from '../ui/NewspaperDivider'
import { PrimaryButton } from '../ui/PrimaryButton'

export function LoginCard() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')

  const isFormValid = useMemo(
    () => loginId.trim().length > 0 && password.length >= 6,
    [loginId, password],
  )

  const handleGoogleSignIn = () => {
    console.log('Google sign in')
  }

  const handleSignIn = () => {
    if (!isFormValid) return
    console.log('Sign in:', { loginId: loginId.trim(), password })
  }

  return (
    <AuthCard
      edition="Special Edition"
      title="Edition Login"
      subtitle="Sign in to continue reading."
      footer={
        <p className="font-body text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <div className="space-y-4">
          <AuthInput
            id="login-id"
            label="Username or email address"
            placeholder="Enter your username or email address"
            value={loginId}
            onChange={setLoginId}
            icon={User}
            autoComplete="username"
          />

          <div className="space-y-2">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              icon={Lock}
              autoComplete="current-password"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="font-editorial text-sm text-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <PrimaryButton onClick={handleSignIn} disabled={!isFormValid}>
            Sign In
          </PrimaryButton>
        </div>

        <NewspaperDivider label="Or" />

        <GoogleButton onClick={handleGoogleSignIn} />
      </div>
    </AuthCard>
  )
}
