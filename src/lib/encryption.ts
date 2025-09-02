import crypto from "crypto"

const rawKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

if (!rawKey) {
 throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY is missing")
}

const ENCRYPTION_KEY = Buffer.from(rawKey, "base64")
const IV_LENGTH = 16

export function encrypt(text: string): string {
 const iv = crypto.randomBytes(IV_LENGTH)
 const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

 let encrypted = cipher.update(text, "utf8", "hex")

 encrypted += cipher.final("hex")

 return iv.toString("hex") + ":" + encrypted
}

export function decrypt(text: string): string {
 if (!text?.includes(":")) {
  return text
 }

 const parts = text.split(":")
 const iv = Buffer.from(parts[0], "hex")
 const encrypted = parts[1]
 const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

 let decrypted = decipher.update(encrypted, "hex", "utf8")

 decrypted += decipher.final("utf8")

 return decrypted
}