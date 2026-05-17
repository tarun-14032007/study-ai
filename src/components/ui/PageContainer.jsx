export default function PageContainer({ title, subtitle, action, children }) {
  return (
    <div className="fade-in">
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {title && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: 5 }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}