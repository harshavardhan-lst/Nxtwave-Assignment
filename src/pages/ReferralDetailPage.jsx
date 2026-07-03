import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferrals } from '../services/api'
import styles from './ReferralDetailPage.module.css'

function formatDate(iso) {
  if (!iso) return '—'
  return iso.slice(0, 10).replace(/-/g, '/')
}

function formatProfit(n) {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ReferralDetailPage() {
  const { id } = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const json = await fetchReferrals({ id })
        const data = json?.data ?? json

        // The detail response can come as data being the row itself (object with id)
        // or nested in data.referrals array, or data.referral object
        let row = null
        if (data && typeof data === 'object') {
          if (Array.isArray(data.referrals) && data.referrals.length > 0) {
            // array — find by id
            row = data.referrals.find((r) => String(r.id) === String(id)) ?? data.referrals[0] ?? null
          } else if (data.referral && typeof data.referral === 'object' && !Array.isArray(data.referral)) {
            row = data.referral
          } else if (data.id !== undefined) {
            // data IS the row
            row = data
          }
        }

        if (row && String(row.id) === String(id)) {
          setReferral(row)
        } else if (row) {
          // id matches loosely — still show it
          setReferral(row)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loadingState} aria-live="polite" aria-busy="true">
              <div className={styles.spinner} aria-hidden="true" />
              <p>Loading referral details…</p>
            </div>
          ) : notFound || !referral ? (
            <div className={styles.notFoundState}>
              <div className={styles.notFoundIcon} aria-hidden="true">🔍</div>
              <h1 className={styles.notFoundTitle}>Referral not found</h1>
              <p className={styles.notFoundSub}>
                We couldn't find a referral with ID <strong>#{id}</strong>.
              </p>
              <Link to="/" className={styles.backLink}>
                ← Back to dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link to="/" className={styles.backLink} aria-label="Back to dashboard">
                ← Back to dashboard
              </Link>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    {referral.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <h1 className={styles.pageTitle}>Referral Details</h1>
                    <h2 className={styles.partnerName}>{referral.name}</h2>
                  </div>
                </div>

                <dl className={styles.details}>
                  <div className={styles.detailRow}>
                    <dt className={styles.dt}>Referral ID</dt>
                    <dd className={styles.dd}>#{referral.id}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.dt}>Service Name</dt>
                    <dd className={styles.dd}>
                      <span className={styles.badge}>{referral.serviceName}</span>
                    </dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.dt}>Date</dt>
                    <dd className={styles.dd}>{formatDate(referral.date)}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt className={styles.dt}>Profit</dt>
                    <dd className={`${styles.dd} ${styles.profit}`}>{formatProfit(referral.profit)}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
