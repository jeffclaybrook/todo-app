import { EmptyIcon } from "./Icons"

export function EmptyState() {
 return (
  <section className="flex flex-col items-center justify-center fixed top-0 left-0 h-screen w-full overflow-hidden -z-10">
   <EmptyIcon />
   <p className="text-slate-800 dark:text-slate-100 text-center mt-4">You haven&apos;t created any todos yet</p>
  </section>
 )
}