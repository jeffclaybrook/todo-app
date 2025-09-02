"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { GridIcon, ListIcon, SearchIcon } from "./Icons"
import { ThemeToggle } from "./ThemeToggle"

type ViewMode = "grid" | "list"

type HeaderProps = {
 view: ViewMode
 onToggleView: () => void
 onSearch: (query: string) => void
}

export function Header({
 view,
 onToggleView,
 onSearch
}: HeaderProps) {
 const [query, setQuery] = useState<string>("")
 const [visible, setVisible] = useState<boolean>(true)
 const [lastScrollY, setLastScrollY] = useState<number>(0)

 useEffect(() => {
  const handleScroll = () => {
   const currentY = window.scrollY

   if (currentY > lastScrollY && currentY > 0) {
    setVisible(false)
   } else {
    setVisible(true)
   }

   setLastScrollY(currentY)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
 }, [lastScrollY])

 const debouncedSearch = useDebouncedCallback((value: string) => {
  onSearch(value.trim().toLowerCase())
 }, 300)

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setQuery(value)
  debouncedSearch(value)
 }

 return (
  <header
   className={cn(
    "flex items-center gap-2 fixed top-0 left-0 right-0 z-40 w-full p-2 lg:px-4 transition-all duration-500 bg-background",
    visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
   )}
  >
   <div className="hidden lg:flex flex-1" />
   <div className="flex items-center mx-auto max-w-xl w-full rounded-full bg-card border pl-4 pr-2">
    <SearchIcon className="size-6 pointer-events-none" />
    <Input
     type="text"
     placeholder="Search todos..."
     value={query}
     onChange={handleChange}
     className="w-full bg-transparent dark:bg-transparent border-none outline-none shadow-none h-12 focus-visible:ring-[0px] mr-auto"
    />
    <Button
     type="button"
     variant="ghost"
     size="icon"
     aria-label="Toggle view"
     onClick={onToggleView}
     className="rounded-full"
    >
     {view === "grid"
      ? <ListIcon className="size-6" />
      : <GridIcon className="size-6" />
     }
    </Button>
   </div>
   <div className="flex items-center justify-end gap-2 flex-1">
    <ThemeToggle />
    <UserButton />
   </div>
  </header>
 )
}