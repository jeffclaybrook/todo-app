import { Todo } from "@prisma/client"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/format-date"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { EditIcon } from "./Icons"

type TodoCardProps = {
 todo: Todo
 onClick: (todo: Todo) => void
 onCheck: (todo: Todo) => void
}

export function TodoCard({
 todo,
 onClick,
 onCheck
}: TodoCardProps) {
 return (
  <Card>
   <CardContent>
    <Checkbox
     id={todo.id}
     checked={todo.completed}
     onCheckedChange={() => onCheck(todo)}
    />
    <div className="flex flex-col gap-2 flex-1">
     <Label
      htmlFor={todo.id}
      className={cn(
       "text-slate-800 dark:text-slate-100",
       todo.completed && "line-through text-slate-500"
      )}
     >
      {todo.title}
     </Label>
     <Badge variant="secondary">{formatDate(todo.updatedAt)}</Badge>
    </div>
    <Button
     type="button"
     variant="ghost"
     size="icon"
     aria-label="Edit todo"
     onClick={() => onClick(todo)}
    >
     <EditIcon className="size-6" />
    </Button>
   </CardContent>
  </Card>
 )
}