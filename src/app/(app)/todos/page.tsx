"use client"

import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { Todo } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomSheet } from "@/components/BottomSheet"
import { CreateButton } from "@/components/CreateTodo"
import { EmptyState } from "@/components/EmptyState"
import { Header } from "@/components/Header"
import { Loader } from "@/components/Loader"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TodoCard } from "@/components/TodoCard"
import { TodoForm } from "@/components/TodoForm"

type ViewMode = "grid" | "list"

export default function Todos() {
 const [todos, setTodos] = useState<Todo[]>([])
 const [view, setView] = useState<ViewMode>("grid")
 const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
 const [query, setQuery] = useState<string>("")
 const [tab, setTab] = useState<"pending" | "completed">("pending")
 const [isLoading, setIsLoading] = useState<boolean>(true)
 const [sheetOpen, setSheetOpen] = useState<boolean>(false)

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
  const stored = localStorage.getItem("viewMode") as ViewMode
  if (stored === "grid" || stored === "list") {
   setView(stored)
  }
 }, [])

 useEffect(() => {
  localStorage.setItem("viewMode", view)
 }, [view])

 const onToggleView = () => {
  setView((prev) => (prev === "grid" ? "list" : "grid"))
 }

 const sortedTodos = [...todos].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
 )

 const filteredTodos = sortedTodos.filter(todo =>
  (tab === "pending" ? !todo.completed : todo.completed) &&
  todo.title?.toLowerCase().includes(query.toLowerCase())
 )

 const pendingTodos = todos.some(todo => !todo.completed)
 const completedTodos = todos.some(todo => todo.completed)

 const toggleTodo = async (id: string) => {
  setTodos(prev =>
   prev.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
   )
  )

  const res = await fetch(`/api/todos/${id}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json"
   },
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
  try {
   setTodos((prev) => {
    const exists = prev.find((todo) => todo.id === savedTodo.id)

    if (exists) {
     return prev.map((todo) => (todo.id === savedTodo.id ? savedTodo : todo))
    }

    return [savedTodo, ...prev]
   })
   
   setSelectedTodo(null)
   setSheetOpen(false)
  } catch (error) {
   console.error(error)
  }
 }

 const handleDelete = async () => {
  if (!selectedTodo) {
   return
  }

  try {
   await fetch(`/api/todos/${selectedTodo.id}`, {
    method: "DELETE"
   })
   setTodos(todos.filter(todo => todo.id !== selectedTodo.id))
   setSheetOpen(false)
   setSelectedTodo(null)
   toast.success("Todo deleted successfully!")
  } catch (error) {
   console.error(error)
   toast.error("Uh-oh! There was a problem deleting your todo")
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

 if (isLoading) {
  return (
   <Loader />
  )
 }

 return (
  <>
   {todos.length === 0 ? (
    <main>
     <header className="flex items-center justify-end gap-2 fixed top-0 left-0 right-0 w-full p-2 lg:px-4">
      <ThemeToggle />
      <UserButton />
     </header>
     <EmptyState />
    </main>
   ) : (
    <main>
     <Header
      onSearch={setQuery}
      view={view}
      onToggleView={onToggleView}
     />
     <Tabs defaultValue="pending" className="pt-18">
      <TabsList className="grid grid-cols-2 w-full mb-4">
       <TabsTrigger value="pending" onClick={() => setTab("pending")}>Pending</TabsTrigger>
       <TabsTrigger value="completed" onClick={() => setTab("completed")}>Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
       {filteredTodos.length === 0 && query.trim() ? (
        <section className="flex items-center justify-center fixed top-0 left-0 w-full h-screen -z-10">
         <p className="text-slate-800 dark:text-slate-100 text-center">No matching todos found.</p>
        </section>
       ) : !pendingTodos && !query.trim() ? (
        <EmptyState />
       ) : (
        <div
         className={view === "grid"
          ? "grid grid-cols-2 lg:grid-cols-4 gap-2 px-2 lg:gap-4 lg:px-4"
          : "flex flex-col gap-2 px-2 lg:gap-4 lg:px-4"
         }
        >
         {filteredTodos.map((todo: Todo) => (
          <TodoCard
           key={todo.id}
           todo={todo}
           onClick={() => openEditSheet(todo)}
           onCheck={() => toggleTodo(todo.id)}
          />
         ))}
        </div>
       )}
      </TabsContent>
      <TabsContent value="completed">
       {filteredTodos.length === 0 && query.trim() ? (
        <section className="flex items-center justify-center fixed top-0 left-0 w-full h-screen -z-10">
         <p className="text-slate-800 dark:text-slate-100 text-center">No matching todos found.</p>
        </section>
       ) : !completedTodos && !query.trim() ? (
        <EmptyState />
       ) : (
        <div
         className={view === "grid"
          ? "grid grid-cols-2 lg:grid-cols-4 gap-2 px-2 lg:gap-4 lg:px-4"
          : "flex flex-col gap-2 px-2 lg:gap-4 lg:px-4"
         }
        >
         {filteredTodos.map((todo: Todo) => (
          <TodoCard
           key={todo.id}
           todo={todo}
           onClick={() => openEditSheet(todo)}
           onCheck={() => toggleTodo(todo.id)}
          />
         ))}
        </div>
       )}
      </TabsContent>
     </Tabs>
    </main>
   )}
   <CreateButton onClick={openCreateSheet} />
   <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
    <TodoForm
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
 )
}