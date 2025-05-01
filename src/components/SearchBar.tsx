"use client"

import { ChangeEvent, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { UserButton } from "@clerk/nextjs"
import { Grid, List, Search } from "./Icons"

type ViewMode = "grid" | "list"

type SearchBarProps = {
 view: ViewMode
 onToggleView: () => void
 onSearch: (query: string) => void
}

export default function SearchBar({ view, onToggleView, onSearch }: SearchBarProps) {
 const [query, setQuery] = useState<string>("")

 const debouncedSearch = useDebouncedCallback((value: string) => {
  onSearch(value.trim().toLowerCase())
 }, 300)

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setQuery(value)
  debouncedSearch(value)
 }

 return (
  <div className="p-2">
   <div className="flex relative rounded-full bg-[#deeaf1]">
    <Search className="absolute inset-y-[13px] left-4 pointer-events-none text-gray-500" />
    <input
     type="text"
     placeholder="Search..."
     value={query}
     onChange={handleChange}
     className="w-full px-12 py-3 text-slate-800 border-none outline-none"
    />
    <div className="flex items-center justify-end gap-4 absolute inset-y-[13px] right-4">
     <button
      onClick={onToggleView}
      aria-label="Toggle view"
      className="text-slate-800 rounded-full cursor-pointer transition hover:text-slate-900"
     >
      {view === "grid" ? <List /> : <Grid />}
     </button>
     <UserButton />
    </div>
   </div>
  </div>
 )
}