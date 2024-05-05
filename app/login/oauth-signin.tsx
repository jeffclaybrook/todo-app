"use client"

import { Provider } from "@supabase/supabase-js"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { oAuthSignIn } from "./actions"

type OAuthProvider = {
 name: Provider
 displayName: string
 icon?: JSX.Element
}

const OAuthButtons = () => {
 const oAuthProviders: OAuthProvider[] = [
  {
   name: "github",
   displayName: "GitHub",
   icon: <Github className="size-5" />
  }
 ]

 return (
  <>
   {oAuthProviders.map((provider, i) => (
    <Button
     key={i}
     variant="outline"
     className="w-full flex items-center justify-center gap-2"
     onClick={async () => {
      await oAuthSignIn(provider.name)
     }}
    >
     {provider.icon}
     Login with {provider.displayName}
    </Button>
   ))}
  </>
 )
}

export default OAuthButtons