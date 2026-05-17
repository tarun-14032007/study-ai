export default function StatCard({ label, value, icon, color = 'var(--accent)', bg = 'var(--accent-soft)', note }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {label}
          </p>
          <p style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, marginTop: 6, letterSpacing: '-0.03em' }}>
            {value}
          </p>
          {note && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: 5 }}>
              {note}
            </p>
          )}
        </div>
        <div className="stat-icon-wrap" style={{ background: bg, color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}