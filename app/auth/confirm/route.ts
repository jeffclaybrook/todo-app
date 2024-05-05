import { type NextRequest, NextResponse } from "next/server"
import { type EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/server"

export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url)
 const token_hash = searchParams.get("token_hash")
 const type = searchParams.get("type") as EmailOtpType | null
 const next = searchParams.get("next") ?? "/todos"
 const redirectTo = req.nextUrl.clone()

 redirectTo.pathname = next
 redirectTo.searchParams.delete("token_hash")
 redirectTo.searchParams.delete("type")

 if (token_hash && type) {
  const supabase = createClient()

  const { error } = await supabase.auth.verifyOtp({
   type,
   token_hash
  })

  if (!error) {
   redirectTo.searchParams.delete("next")
   return NextResponse.redirect(redirectTo)
  }
 }

 redirectTo.pathname = "/lgoin?message=Could not verify OTP"
 return NextResponse.redirect(redirectTo)
}