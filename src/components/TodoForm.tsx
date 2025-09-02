"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Todo } from "@prisma/client"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { DeleteIcon } from "./Icons"

const todoFormSchema = z.object({
 title: z.string()
})

type TodoFormValues = z.infer<typeof todoFormSchema>

type TodoFormProps = {
 onSave: (todo: Todo) => void
 onCancel: () => void
 initialTodo?: Todo
 onDelete?: () => void
}

export function TodoForm({
 onSave,
 onCancel,
 initialTodo,
 onDelete
}: TodoFormProps) {
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

 const form = useForm<TodoFormValues>({
  resolver: zodResolver(todoFormSchema),
  defaultValues: {
   title: initialTodo?.title || "",
  }
 })

 const handleSubmit = async (values: TodoFormValues) => {
  setIsSubmitting(true)

  const method = initialTodo ? "PUT" : "POST"
  const url = initialTodo ? `/api/todos/${initialTodo.id}` : "/api/todos"

  try {
   const res = await fetch(url, {
    method,
    headers: {
     "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
   })

   if (res.ok) {
    const todo: Todo = await res.json()
    form.reset()
    onSave(todo)
    toast.success("Todo created successfully!")
   }
  } catch (error) {
   console.error(error)
   toast.error("Uh-oh! Looks like something went wrong")
  } finally {
   setIsSubmitting(false)
  }
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 max-w-lg w-full mx-auto">
    <h1 className="text-slate-800 dark:text-slate-100 text-center text-2xl">{initialTodo ? "Update Todo" : "Create Todo"}</h1>
    <FormField
     control={form.control}
     name="title"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Title</FormLabel>
       <FormControl>
        <Input
         type="text"
         placeholder="Title"
         autoFocus
         required
         className="h-12 focus-visible:ring-[1px]"
         {...field}
        />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <div className="flex items-center justify-end gap-4">
     {onDelete ? (
      <AlertDialog>
       <AlertDialogTrigger asChild>
        <Button
         type="button"
         variant="destructive"
         aria-label="Delete note"
         className="py-5"
        >
         <DeleteIcon className="size-6" />
         Delete
        </Button>
       </AlertDialogTrigger>
       <AlertDialogContent>
        <AlertDialogHeader>
         <AlertDialogTitle>Are you sure you want to delete this todo?</AlertDialogTitle>
         <AlertDialogDescription>This action cannot be undone and will permanently delete this todo.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
         <AlertDialogCancel>Cancel</AlertDialogCancel>
         <AlertDialogAction onClick={() => onDelete?.()}>
          <DeleteIcon className="size-6" />
          Delete
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     ) : (
      <Button
       type="button"
       variant="ghost"
       aria-label="Cancel"
       onClick={onCancel}
       className="py-5"
      >
       Cancel
      </Button>
     )}
     <Button
      type="submit"
      disabled={isSubmitting}
      aria-label="Save note"
      className="text-white bg-[#4c5d87] px-6 py-5 transition duration-100 hover:bg-slate-700 hover:shadow-xl"
     >
      {isSubmitting ? "Saving..." : "Save"}
     </Button>
    </div>
   </form>
  </Form>
 )
}