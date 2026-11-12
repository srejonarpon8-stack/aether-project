/**
 * Sends the contact form. Uses whichever service is configured in `.env`.
 * Returns 'sent' or 'mailto'. Throws if nothing is configured or the request fails.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const FORMSPREE = import.meta.env.VITE_FORMSPREE_ENDPOINT
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL

export const CONTACT_EMAIL = EMAIL || ''

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* some services reply without JSON */
  }
  return { ok: res.ok, data }
}

export default async function sendEnquiry({ name, email, type, message }) {
  const subject = `New AETHER enquiry — ${type}`

  if (WEB3FORMS_KEY) {
    const { ok, data } = await postJson('https://api.web3forms.com/submit', {
      access_key: WEB3FORMS_KEY,
      subject,
      name,
      email,
      type,
      message,
    })
    if (!ok || data.success === false) throw new Error('send-failed')
    return 'sent'
  }

  if (FORMSPREE) {
    const { ok } = await postJson(FORMSPREE, { name, email, type, message, _subject: subject })
    if (!ok) throw new Error('send-failed')
    return 'sent'
  }

  if (EMAIL) {
    const body = `${message}\n\n— ${name} (${email})`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return 'mailto'
  }

  throw new Error('not-configured')
}
