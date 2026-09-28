import "server-only"
import { timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"

const COOKIE = "admin_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Read an env var, forgiving copy-paste slips from hosting dashboards:
 * surrounding whitespace and a matching pair of wrapping quotes ("value" / 'value').
 */
function env(name: string) {
  const raw = process.env[name]?.trim() ?? ""
  const quoted = raw.length >= 2 && (raw[0] === '"' || raw[0] === "'") && raw.at(-1) === raw[0]
  return quoted ? raw.slice(1, -1) : raw
}

/**
 * Explains what's missing from the admin login setup, or null when it's ready.
 * Shown on the login form so a misconfigured deploy says what to fix instead of crashing.
 */
export function authConfigError() {
  const missing = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "AUTH_SECRET"].filter((name) => !env(name))
  if (missing.length) {
    return `Admin login isn't set up: add ${missing.join(", ")} to your environment variables (on Vercel: Settings → Environment Variables), then redeploy.`
  }
  if (env("AUTH_SECRET").length < 32) {
    return "Admin login isn't set up: AUTH_SECRET must be at least 32 characters long. Update it in your environment variables, then redeploy."
  }
  return null
}

function secretKey() {
  const secret = env("AUTH_SECRET")
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long.")
  }
  return new TextEncoder().encode(secret)
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function checkCredentials(email: string, password: string) {
  const adminEmail = env("ADMIN_EMAIL")
  const adminPassword = env("ADMIN_PASSWORD")
  if (!adminEmail || !adminPassword) return false
  // Evaluate both so timing doesn't reveal which one was wrong.
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase())
  const passwordOk = safeEqual(password, adminPassword)
  return emailOk && passwordOk
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey())

  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(COOKIE)
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload.role === "admin"
  } catch {
    return false
  }
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login")
}
