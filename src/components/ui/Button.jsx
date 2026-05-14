function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
}) {

  const baseStyles =
    'px-5 py-3 rounded-lg font-semibold transition-all duration-200'

  const variants = {
    primary:
      'bg-blue-500 hover:bg-blue-600 text-white',

    secondary:
      'bg-zinc-700 hover:bg-zinc-600 text-white',

    danger:
      'bg-red-500 hover:bg-red-600 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button