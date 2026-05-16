export default function PageContainer({ children, title, subtitle, action, className = '' }) {
  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-8 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-zinc-500 text-sm mt-0.5">{subtitle}</p>}
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}