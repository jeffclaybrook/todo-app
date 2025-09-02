import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 })
 }

 const todo = await prisma.todo.findUnique({
  where: { id }
 })

 if (!todo || todo.userId !== userId) {
  return NextResponse.json({ error: "Todo not found" }, { status: 404 })
 }

 const { title, completed } = await req.json()

 try {
  const updated = await prisma.todo.update({
   where: {
    id: id,
    userId: userId
   },
   data: {
    ...(title !== undefined && { title: encrypt(title) }),
    ...(completed !== undefined && { completed })
   }
  })

  const decrypted = {
   ...updated,
   title: decrypt(updated.title),
   completed: updated.completed
  }

  return NextResponse.json(decrypted)
 } catch (error) {
  console.error(error)
  return NextResponse.json({ error: "Unable to update todo" }, { status: 404 })
 }
}

export async function DELETE(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 })
 }

 const todo = await prisma.todo.findUnique({
  where: { id }
 })

 if (!todo || todo.userId !== userId) {
  return NextResponse.json({ error: "Todo not found" }, { status: 404 })
 }

 await prisma.todo.delete({
  where: { id }
 })

 return NextResponse.json({ success: true })
}