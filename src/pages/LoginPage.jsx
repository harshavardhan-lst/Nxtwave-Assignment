import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { signIn } from '../services/api'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already authenticated → go to dashboard
  if (Cookies.get('jwt_token')) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const json = await signIn(email, password)
      const token = json?.data?.token
      if (!token) {
        throw new Error(json?.message || 'No token received from server.')
      }
      Cookies.set('jwt_token', token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Decorative blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <main className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>G</div>
          <h1 className={styles.brandName}>Go Business</h1>
        </div>

        <p className={styles.tagline}>Sign in to open your referral dashboard.</p>

        {/* Error message */}
        {error && (
          <div className={styles.error} role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Button always enabled per spec */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            id="sign-in-button"
          >
            {loading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    </div>
  )
}
