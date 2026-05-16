export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={`
      bg-zinc-900 border border-zinc-800 rounded-2xl
      ${padding ? 'p-5' : ''}
      ${hover ? 'hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}