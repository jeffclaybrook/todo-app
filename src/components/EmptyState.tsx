import { Empty } from "./Icons"

export default function EmptyState() {
 return (
  <main className="flex flex-col items-center justify-center h-screen">
   <Empty />
   <p className="text-slate-800 text-center mt-8">You haven&apos;t created any todos yet!</p>
  </main>
 )
}