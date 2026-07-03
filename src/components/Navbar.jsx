import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.brand}
          aria-label="Go to dashboard home"
        >
          <span className={styles.brandIcon}>G</span>
          Go Business
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
        </nav>

        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </header>
  )
}
