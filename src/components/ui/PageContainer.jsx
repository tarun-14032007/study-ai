function PageContainer({
  title,
  children,
}) {
  return (
    <section className="w-full">

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          {title}
        </h1>

      </div>

      {children}

    </section>
  )
}

export default PageContainer