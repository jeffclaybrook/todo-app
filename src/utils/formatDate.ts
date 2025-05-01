import { formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date) {
 return formatDistanceToNow(new Date(date), { addSuffix: true })
}