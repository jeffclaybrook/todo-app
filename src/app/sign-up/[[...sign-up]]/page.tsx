import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
 return (
  <main className="flex items-center justify-center h-screen animate-fade-in">
   <SignUp />
  </main>
 )
}