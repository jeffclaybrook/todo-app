import Link from "next/link"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/server"
import { signOut } from "@/app/login/actions"

const Header = async () => {
 const supabase = createClient()

 const {
  data: { user }
 } = await supabase.auth.getUser()

 return (
  <header className="z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
   <div className="container flex h-14 max-w-screen-2xl items-center">
    <nav className="flex items-center space-x-4 lg:space-x-6">
     <Link href="/" className="mr-6 flex items-center space-x-2">SupaTodo</Link>
     <Link href="/todos">Todos</Link>
    </nav>
    <div className="flex flex-1 items-center justify-end space-x-2">
     {user !== null ? (
      <form action={signOut} className="flex items-center gap-2">
       <span>{user.email}</span>
       <Button>Sign out</Button>
      </form>
     ) : (
      <Button asChild>
       <Link href="/login">Sign in</Link>
      </Button>
     )}
    </div>
   </div>
  </header>
 )
}

export default Header