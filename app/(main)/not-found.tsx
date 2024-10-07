import Link from "next/link"

export default async function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mb-8 text-3xl font-semibold text-gray-600">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-500">Oops! The page you're looking for seems to have swum away.</p>
        <div className="inline-block overflow-hidden rounded-lg bg-blue-500 shadow-lg transition-transform hover:scale-105">
          <Link
            href="/"
            className="block px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Dive Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}
