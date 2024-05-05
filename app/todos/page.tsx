import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { TodoList } from "@/components/todo-list"
import { Separator } from "@/components/ui/separator"

const TodosPage = async () => {
 const supabase = createClient()

 const {
  data: {
   user
  }
 } = await supabase.auth.getUser()

 if (!user) {
  return redirect("/login")
 }

 const { data: todos } = await supabase.from("todos").select().order("inserted_at", { ascending: false })

 return (
  <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-4">
   <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Todo</h1>
   <Separator className="w-full" />
   <TodoList todos={todos ?? []} />
  </section>
 )
}

export default TodosPage