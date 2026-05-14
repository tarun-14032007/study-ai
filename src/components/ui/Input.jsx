function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        bg-zinc-800
        border
        border-zinc-700
        rounded-lg
        px-4
        py-3
        outline-none
        focus:border-blue-500
      "
    />
  )
}

export default Input