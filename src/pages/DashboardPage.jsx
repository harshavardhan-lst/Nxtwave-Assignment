import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferrals } from '../services/api'
import styles from './DashboardPage.module.css'

/* ── helpers ── */
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

const PAGE_SIZE = 10

/* ── sub-components ── */

function MetricCard({ label, value }) {
  return (
    <div className={styles.metricCard}>
      <p className={styles.metricValue}>{value}</p>
      <p className={styles.metricLabel}>{label}</p>
    </div>
  )
}

function CopyField({ label, value, id }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(value || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className={styles.copyField}>
      <label htmlFor={id} className={styles.copyLabel}>{label}</label>
      <div className={styles.copyRow}>
        <input
          id={id}
          type="text"
          readOnly
          value={value || ''}
          className={styles.copyInput}
          aria-label={label}
        />
        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()

  /* API state */
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* Table state */
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [referrals, setReferrals] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [page, setPage] = useState(1)

  const searchDebounceRef = useRef(null)

  /* ── Initial full fetch ── */
  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const json = await fetchReferrals({ sort: 'desc' })
        const data = json?.data ?? json

        setDashData(data)
        setReferrals(Array.isArray(data?.referrals) ? data.referrals : [])
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  /* ── Fetch referrals on search / sort change ── */
  const fetchTable = useCallback(async (searchVal, sortVal) => {
    setTableLoading(true)
    setPage(1)
    try {
      const json = await fetchReferrals({ search: searchVal || undefined, sort: sortVal })
      const data = json?.data ?? json
      const rows = Array.isArray(data?.referrals) ? data.referrals : []
      setReferrals(rows)

      // Also refresh dashboard sections if full dataset
      if (!searchVal && dashData) {
        setDashData((prev) => ({ ...prev, ...data }))
      }
    } catch (err) {
      setError(err.message || 'Failed to load referrals.')
    } finally {
      setTableLoading(false)
    }
  }, [dashData])

  function handleSearchChange(e) {
    const val = e.target.value
    setSearch(val)
    clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      fetchTable(val, sort)
    }, 350)
  }

  function handleSortChange(e) {
    const val = e.target.value
    setSort(val)
    fetchTable(search, val)
  }

  /* ── Pagination ── */
  const totalRows = referrals.length
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
  const from = totalRows === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, totalRows)
  const pageRows = referrals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleRowClick(id) {
    navigate(`/referral/${id}`)
  }

  /* ── Render ── */
  if (loading) {
    return (
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loadingState} aria-live="polite" aria-busy="true">
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <p>Loading dashboard…</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error && !dashData) {
    return (
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.errorState} role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const metrics = dashData?.metrics ?? []
  const serviceSummary = dashData?.serviceSummary ?? {}
  const referral = dashData?.referral ?? {}

  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Referral Dashboard</h1>
            <p className={styles.pageSubtitle}>
              Track your referrals, earnings, and partner activity in one place.
            </p>
          </div>

          {/* Error banner (non-fatal) */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* ── A. Overview ── */}
          <section
            className={styles.section}
            role="region"
            aria-label="Overview metrics"
          >
            <h2 className={styles.sectionTitle}>Overview</h2>
            <div className={styles.metricsGrid}>
              {metrics.map((m) => (
                <MetricCard key={m.id ?? m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </section>

          {/* ── B. Service Summary ── */}
          <section
            className={styles.section}
            role="region"
            aria-label="Service summary"
          >
            <h2 className={styles.sectionTitle}>Service summary</h2>
            <div className={styles.serviceCard}>
              <div className={styles.serviceGrid}>
                <div className={styles.serviceItem}>
                  <p className={styles.serviceLabel}>Service</p>
                  <p className={styles.serviceValue}>{serviceSummary.service ?? '—'}</p>
                </div>
                <div className={styles.serviceItem}>
                  <p className={styles.serviceLabel}>Your Referrals</p>
                  <p className={styles.serviceValue}>{serviceSummary.yourReferrals ?? '—'}</p>
                </div>
                <div className={styles.serviceItem}>
                  <p className={styles.serviceLabel}>Active Referrals</p>
                  <p className={styles.serviceValue}>{serviceSummary.activeReferrals ?? '—'}</p>
                </div>
                <div className={styles.serviceItem}>
                  <p className={styles.serviceLabel}>Total Ref. Earnings</p>
                  <p className={styles.serviceValue}>{serviceSummary.totalRefEarnings ?? '—'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── C. Share Referral ── */}
          <section
            className={styles.section}
            role="region"
            aria-label="Share referral"
          >
            <h2 className={styles.sectionTitle}>Refer friends and earn more</h2>
            <div className={styles.shareCard}>
              <div className={styles.shareGlow} aria-hidden="true" />
              <div className={styles.shareFields}>
                <CopyField
                  id="referral-link"
                  label="Your Referral Link"
                  value={referral.link}
                />
                <CopyField
                  id="referral-code"
                  label="Your Referral Code"
                  value={referral.code}
                />
              </div>
            </div>
          </section>

          {/* ── D. All Referrals Table ── */}
          <section className={styles.section} aria-label="All referrals">
            <h2 className={styles.sectionTitle}>All referrals</h2>

            <div className={styles.tableToolbar}>
              {/* Search */}
              <div className={styles.searchWrap}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Name or service…"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search referrals"
                  id="search-referrals"
                />
              </div>

              {/* Sort */}
              <label className={styles.sortLabel} htmlFor="sort-select">
                Sort by date
                <select
                  id="sort-select"
                  className={styles.sortSelect}
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
              {tableLoading && (
                <div className={styles.tableOverlay} aria-live="polite" aria-busy="true">
                  <div className={styles.loadingSpinner} aria-hidden="true" />
                </div>
              )}
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Service</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={styles.emptyState}>
                        No matching entries
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        className={styles.tr}
                        onClick={() => handleRowClick(row.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleRowClick(row.id)
                        }}
                        aria-label={`View referral details for ${row.name}`}
                      >
                        <td className={styles.td}>{row.name}</td>
                        <td className={styles.td}>
                          <span className={styles.serviceBadge}>{row.serviceName}</span>
                        </td>
                        <td className={styles.td}>{formatDate(row.date)}</td>
                        <td className={`${styles.td} ${styles.profit}`}>{formatProfit(row.profit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRows > 0 && (
              <div className={styles.pagination}>
                <p className={styles.paginationInfo}>
                  Showing {from}–{to} of {totalRows} entries
                </p>

                <div className={styles.paginationControls}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                      onClick={() => setPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={p === page ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className={styles.pageBtn}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
