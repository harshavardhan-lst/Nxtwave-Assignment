import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <main className={styles.content}>
        <div className={styles.code} aria-hidden="true">404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className={styles.backLink}>
          ← Back to dashboard
        </Link>
      </main>
    </div>
  )
}
