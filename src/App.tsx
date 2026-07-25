import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from './components/forgot-password/ForgotPasswordPage'
import { LoginPage } from './components/login/LoginPage'
import { ResetPasswordPage } from './components/reset-password/ResetPasswordPage'
import { SignUpPage } from './components/signup/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
