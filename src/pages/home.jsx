import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="
      min-h-screen
      bg-zinc-900
      text-white
      flex
      flex-col
      items-center
      justify-center
      gap-6
    ">

      <h1 className="text-6xl font-bold">
        Study AI
      </h1>

      <p className="text-zinc-400 text-xl">
        AI-powered student productivity platform
      </p>

      <Link to="/dashboard">
        <button className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </Link>

    </div>
  )
}

export default Home