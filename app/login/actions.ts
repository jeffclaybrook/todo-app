"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Provider } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/server"
import { getURL } from "@/utils/helpers"

export const emailLogin = async (formData: FormData) => {
 const supabase = createClient()
 const data = {
  email: formData.get("email") as string,
  password: formData.get("password") as string
 }

 const { error } = await supabase.auth.signInWithPassword(data)

 if (error) {
  redirect("/login?message=Could not authenticate user")
 }

 revalidatePath("/", "layout")
 redirect("/todos")
}

export const signUp = async (formData: FormData) => {
 const supabase = createClient()
 const data = {
  email: formData.get("email") as string,
  password: formData.get("password") as string
 }

 const { error } = await supabase.auth.signUp(data)

 if (error) {
  redirect("/login?message=Error signing up")
 }

 revalidatePath("/", "layout")
 redirect("/login")
}

export const signOut = async () => {
 const supabase = createClient()
 await supabase.auth.signOut()
 redirect("/login")
}

export const oAuthSignIn = async (provider: Provider) => {
 if (!provider) {
  return redirect("/login?message=No provider selected")
 }

 const supabase = createClient()
 const redirectUrl = getURL("/auth/callback")

 const { data, error } = await supabase.auth.signInWithOAuth({
  provider,
  options: {
   redirectTo: redirectUrl
  }
 })

 if (error) {
  redirect("/login?message=Could not authenticate user")
 }

 return redirect(data.url)
}