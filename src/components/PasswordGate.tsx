import { useState, type FormEvent } from 'react'

const PASSWORD = 'ProtoSwat'
const UNLOCK_KEY = 'proto-swat-unlocked'

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(UNLOCK_KEY) === 'true')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value === PASSWORD) {
      localStorage.setItem(UNLOCK_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f3f4f6', fontFamily: 'inherit', zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320, background: '#fff', borderRadius: 12, padding: '28px 24px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Protected prototype</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Enter the password to continue.</p>
        </div>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          placeholder="Password"
          style={{
            fontSize: 14, padding: '9px 11px', borderRadius: 7,
            border: `1px solid ${error ? '#dc2626' : '#e2e8f0'}`, outline: 'none', fontFamily: 'inherit',
          }}
        />
        {error && <p style={{ fontSize: 12, color: '#dc2626', margin: 0 }}>Incorrect password.</p>}
        <button
          type="submit"
          style={{
            padding: '9px 12px', borderRadius: 7, border: 'none', background: '#5e6ad2',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Continue
        </button>
      </form>
    </div>
  )
}
