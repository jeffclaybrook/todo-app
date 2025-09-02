import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const todos = await prisma.todo.findMany({
  where: { userId },
  orderBy: {
   updatedAt: "desc"
  }
 })

 const decrypted = todos.map((todo) => ({
  ...todo,
  title: decrypt(todo.title)
 }))

 return NextResponse.json(decrypted)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { title } = await req.json()

 if (!title) {
  return NextResponse.json({ error: "Title is required" }, { status: 400 })
 }

 const todo = await prisma.todo.create({
  data: {
   title: encrypt(title),
   userId
  }
 })

 const decrypted = {
  ...todo,
  title: decrypt(todo.title)
 }

 return NextResponse.json(decrypted)
}