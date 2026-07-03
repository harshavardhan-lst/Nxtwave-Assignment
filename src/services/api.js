import Cookies from 'js-cookie'

const AUTH_BASE = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth'
const REFERRALS_BASE = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

/** Returns the Authorization header using the stored jwt_token cookie */
function authHeader() {
  const token = Cookies.get('jwt_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * POST /api/auth/signin
 * Returns { data: { token } } on success or throws with message string on failure.
 */
export async function signIn(email, password) {
  const res = await fetch(`${AUTH_BASE}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || 'Sign in failed. Please try again.')
  }

  return json // caller reads json.data.token
}

/**
 * GET /api/referrals   (full list, search, sort, or single by id)
 * @param {Object} params - { search, sort, id }
 */
export async function fetchReferrals(params = {}) {
  const url = new URL(REFERRALS_BASE)

  if (params.id !== undefined && params.id !== null) {
    url.searchParams.set('id', params.id)
  }
  if (params.search) {
    url.searchParams.set('search', params.search)
  }
  if (params.sort) {
    url.searchParams.set('sort', params.sort)
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  })

  const json = await res.json()

  if (!res.ok) {
    const msg = json.message || `Request failed with status ${res.status}`
    throw new Error(msg)
  }

  return json // caller reads json.data
}
