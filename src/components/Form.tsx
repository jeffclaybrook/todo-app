"use client"

import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Todo } from "@prisma/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Delete } from "./Icons"

type FormProps = {
 onSave: (todo: Todo) => void
 onCancel: () => void
 initialTodo?: Todo
 onDelete?: () => void
}

export default function Form({ onSave, onCancel, initialTodo, onDelete }: FormProps) {
 const [title, setTitle] = useState(initialTodo?.title || "")
 const [isLoading, setIsLoading] = useState<boolean>(false)
 const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const method = initialTodo ? "PUT" : "POST"
  const url = initialTodo ? `/api/todos/${initialTodo.id}` : "/api/todos"

  try {
   const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
   })

   if (res.ok) {
    const todo: Todo = await res.json()
    setTitle("")
    onSave(todo)
    toast.success("Todo created successfully")
   }
  } catch (error) {
   console.error("Something went wrong", error)
   toast.error("Uh-oh! Looks like something went wrong")
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <>
   <div className="flex flex-col gap-4 max-w-lg mx-auto">
    <h1 className="text-slate-800 text-lg">Todo</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
     <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={e => setTitle(e.target.value)}
      className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
     />
     <div className="flex items-center justify-end gap-4">
      {onDelete ? (
       <button
        type="button"
        onClick={() => setShowDeleteModal(true)}
        aria-label="Delete todo"
        className="inline-flex items-center justify-center gap-1 px-2 py-4 text-red-500 cursor-pointer transition hover:text-red-700"
       >
        <Delete />
        Delete
       </button>
      ) : (
       <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel"
        className="text-gray-500 cursor-pointer py-2 px-4 transition hover:text-gray-700"
       >
        Cancel
       </button>
      )}
      <button
       type="submit"
       aria-label="Save todo"
       disabled={isLoading}
       className="text-white bg-[#4c5d87] py-2 px-6 rounded-full cursor-pointer transition shadow-lg hover:bg-slate-600"
      >
       {isLoading ? "Saving..." : "Save"}
      </button>
     </div>
    </form>
   </div>
   {showDeleteModal && (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
     <DialogContent className="max-w-md">
      <DialogHeader>
       <DialogTitle className="text-slate-800 text-start">Delete Todo</DialogTitle>
      </DialogHeader>
      <p className="text-slate-600 text-sm">Are you sure you want to delete this todo?</p>
      <DialogFooter className="flex flex-row items-center justify-end gap-2">
       <button
        onClick={() => setShowDeleteModal(false)}
        aria-label="Cancel"
        className="text-gray-500 cursor-pointer py-2 px-4 transition hover:text-gray-700"
       >
        Cancel
       </button>
       <button
        onClick={() => {
         setShowDeleteModal(false)
         onDelete?.()
        }}
        aria-label="Delete todo"
        className="inline-flex items-center justify-center gap-1 py-2 px-4 text-red-500 cursor-pointer transition hover:text-red-700"
       >
        <Delete />
        Delete
       </button>
      </DialogFooter>
     </DialogContent>
    </Dialog>
   )}
  </>
 )
}