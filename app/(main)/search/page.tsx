import FishesSearchForm from "@/features/search/components/fishes-search-form"

export default function SearchPage() {
  return (
    <>
      <div className="container relative pb-20 pt-10">
        <h1 className="px-5 py-4 text-3xl font-bold tracking-tighter">Search</h1>
        <FishesSearchForm />
      </div>
    </>
  )
}
