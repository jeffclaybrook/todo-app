import { LoadingIcon } from "./Icons"

export function Loader() {
 return (
  <main className="flex flex-col items-center justify-center h-screen">
   <LoadingIcon className="size-12 text-slate-600 dark:text-slate-300 animate-spin" />
   <p className="text-slate-800 dark:text-slate-100 text-center pt-4 animate-pulse">Loading todos...</p>
  </main>
 )
}