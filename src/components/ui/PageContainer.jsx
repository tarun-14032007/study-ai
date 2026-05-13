function PageContainer({ title, children }) {
  return (
    <div className="w-full">

      <h1 className="text-3xl font-bold mb-6">
        {title}
      </h1>

      <div>
        {children}
      </div>

    </div>
  )
}

export default PageContainer