"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { Todo } from "@prisma/client"
import { Add, Edit } from "@/components/Icons"
import { formatDate } from "@/utils/formatDate"
import clsx from "clsx"
import BottomSheet from "@/components/BottomSheet"
import EmptyState from "@/components/EmptyState"
import Form from "@/components/Form"
import SearchBar from "@/components/SearchBar"
import Spinner from "@/components/Spinner"

type ViewMode = "grid" | "list"

export default function Home() {
 const { isLoaded, isSignedIn } = useAuth()
 const [todos, setTodos] = useState<Todo[]>([])
 const [isLoading, setIsLoading] = useState<boolean>(true)
 const [query, setQuery] = useState<string>("")
 const [view, setView] = useState<ViewMode>("grid")
 const [sheetOpen, setSheetOpen] = useState<boolean>(false)
 const [tab, setTab] = useState<"pending" | "completed">("pending")
 const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
 const [visible, setVisible] = useState<boolean>(true)
 const [lastScrollY, setLastScrollY] = useState<number>(0)
 const router = useRouter()

 useEffect(() => {
  const fetchTodos = async () => {
   const res = await fetch("/api/todos")
   const data = await res.json()
   setTodos(data)
   setIsLoading(false)
  }

  fetchTodos()
 }, [])

 useEffect(() => {
  if (isLoaded && !isSignedIn) {
   router.push("/sign-in")
  }
 }, [isLoaded, isSignedIn])

 useEffect(() => {
  const stored = localStorage.getItem("viewMode") as ViewMode
  if (stored === "grid" || stored === "list") setView(stored)
 }, [])

 useEffect(() => {
  localStorage.setItem("viewMode", view)
 }, [view])

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

 const toggleView = () => {
  setView((prev) => (prev === "grid" ? "list" : "grid"))
 }

 const sortedTodos = [...todos].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
 )

 const filteredTodos = sortedTodos.filter(todo =>
  (tab === "pending" ? !todo.completed : todo.completed) &&
  todo.title?.toLowerCase().includes(query.toLowerCase())
 )

 const hasPendingTodos = todos.some(todo => !todo.completed)
 const hasCompletedTodos = todos.some(todo => todo.completed)

 const toggleTodo = async (id: string) => {
  setTodos(prev =>
   prev.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
   )
  )

  const res = await fetch(`/api/todos/${id}`, {
   method: "PUT",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    completed: !todos.find(todo => todo.id === id)?.completed
   })
  })

  if (!res.ok) {
   setTodos(prev =>
    prev.map(todo =>
     todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
   )
  }
 }

 const handleSave = async (savedTodo: Todo) => {
  setTodos((prevTodos) => {
   const exists = prevTodos.find((todo) => todo.id === savedTodo.id)

   if (exists) {
    return prevTodos.map((todo) => (todo.id === savedTodo.id ? savedTodo : todo))
   }

   return [savedTodo, ...prevTodos]
  })

  setSelectedTodo(null)
  setSheetOpen(false)
 }

 const handleDelete = async () => {
  if (!selectedTodo) return

  try {
   await fetch(`/api/todos/${selectedTodo.id}`, {
    method: "DELETE"
   })
   setTodos(todos.filter(todo => todo.id !== selectedTodo.id))
   setSheetOpen(false)
   setSelectedTodo(null)
   toast.success("Todo deleted successfully~")
  } catch (error) {
   console.error("Error deleting todo:", error)
   toast.error("Uh-oh! Something went wrong")
  }
 }

 const openCreateSheet = () => {
  setSelectedTodo(null)
  setSheetOpen(true)
 }

 const openEditSheet = (todo: Todo) => {
  setSelectedTodo(todo)
  setSheetOpen(true)
 }

 return (
  <>
   {isLoading ? (
    <Spinner />
   ) : (
    <>
     {todos.length === 0 ? (
      <>
       <nav className="flex items-center justify-end fixed top-0 left-0 right-0 w-full p-4">
        <UserButton />
       </nav>
       <EmptyState />
      </>
     ) : (
      <>
       <header
        className={clsx(
         "fixed top-0 left-0 right-0 w-full transition-all duration-500 flex flex-col z-40 bg-white",
         visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
        )}
       >
        <SearchBar onSearch={setQuery} view={view} onToggleView={toggleView} />
        <div className="flex items-center justify-center">
         <button
          onClick={() => setTab("pending")}
          aria-label="Pending"
          className={clsx(
           "flex-1 cursor-pointer transition font-medium py-2",
           tab === "pending" ? "text-[#4c5d87] border-b border-[#4c5d87]" : "text-gray-400 border-b border-slate-200"
          )}
         >
          Pending
         </button>
         <button
          onClick={() => setTab("completed")}
          aria-label="Completed"
          className={clsx(
           "flex-1 cursor-pointer transition font-medium py-2",
           tab === "completed" ? "text-[#4c5d87] border-b border-[#4c5d87]" : "text-gray-400 border-b border-slate-200"
          )}
         >
          Completed
         </button>
        </div>
       </header>
       <main className="p-2 lg:p-4">
        {filteredTodos.length === 0 && query.trim() ? (
         <p className="text-slate-800 text-center mt-10">No matching todos found.</p>
        ) : tab === "pending" && !hasPendingTodos && !query.trim() ? (
         <EmptyState />
        ) : tab === "completed" && !hasCompletedTodos && !query.trim() ? (
         <EmptyState />
        ) : (
         <ul className={view === "grid" ? "grid lg:grid-cols-4 gap-2 lg:gap-4 pt-28" : "flex flex-col gap-2 lg:gap-4 pt-28"}>
          {filteredTodos.map((todo: Todo) => (
           <li key={todo.id} className="flex items-center justify-between gap-4 p-4 rounded-md border border-slate-200">
            <input
             type="checkbox"
             checked={todo.completed}
             onChange={() => toggleTodo(todo.id)}
             className="w-5 h-5 cursor-pointer"
            />
            <div className="flex flex-col flex-1">
             <h2
              className={clsx(
               "text-slate-800",
               todo.completed && "line-through text-slate-400"
              )}
             >
              {todo.title}
             </h2>
             <span className="text-slate-500 text-xs">{formatDate(new Date(todo.updatedAt))}</span>
            </div>
            <button
             onClick={() => openEditSheet(todo)}
             aria-label="Edit todo"
             className="text-slate-800 p-2 rounded-full cursor-pointer transition hover:bg-slate-100"
            >
             <Edit />
            </button>
           </li>
          ))}
         </ul>
        )}
       </main>
       <button
        onClick={openCreateSheet}
        aria-label="Create todo"
        className="inline-flex items-center gap-2 fixed bottom-6 right-6 text-white bg-[#4c5d87] p-4 lg:px-6 rounded-xl shadow-lg cursor-pointer hover:bg-slate-700"
       >
        <Add />
        <span className="hidden lg:block">Create</span>
       </button>
       <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Form
         onSave={handleSave}
         initialTodo={selectedTodo || undefined}
         onDelete={selectedTodo ? handleDelete : undefined}
         onCancel={() => {
          setSheetOpen(false)
          setSelectedTodo(null)
         }}
        />
       </BottomSheet>
      </>
     )}
    </>
   )}
  </>
 )
}