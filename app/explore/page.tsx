import Link from "next/link"

export default function ExplorePage() {
  return (
    <div className="flex">
      <Link href="/explore/fauna">Fauna</Link>
      <Link href="/explore/flora">Flora</Link>
    </div>
  )
}
