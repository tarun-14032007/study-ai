function Card({ children }) {
  return (
    <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
      {children}
    </div>
  )
}

export default Card