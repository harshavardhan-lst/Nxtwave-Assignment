import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>G</span>
          <span>Go Business</span>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="#about" className={styles.link}>About</a>
          <a href="#privacy" className={styles.link}>Privacy</a>
        </nav>

        <p className={styles.copy}>© 2024 Go Business</p>
      </div>
    </footer>
  )
}
