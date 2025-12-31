import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { nextCookies } from "better-auth/next-js"
import { username } from "better-auth/plugins"
import type { ZodError } from "zod"
import * as schema from "@/db/schema"
import { db } from "@/lib/db"
import { signInSchema, signUpSchema } from "@/utils/validations"

const fieldErrorMap: Record<string, string> = {
  email: "INVALID_EMAIL",
  password: "INVALID_PASSWORD",
  name: "INVALID_NAME",
  username: "INVALID_USERNAME",
  displayUsername: "INVALID_DISPLAY_USERNAME",
}

function getErrorCodes(error: ZodError) {
  return Array.from(
    new Set(error.issues.map(i => fieldErrorMap[i.path[0] as string]))
  )
}

const beforeHook = createAuthMiddleware(async ctx => {
  if (ctx.path === "/sign-up/email") {
    const parsed = signUpSchema.safeParse({
      email: ctx?.body?.email,
      name: ctx?.body?.name,
      password: ctx?.body?.password,
      username: ctx?.body?.username,
      displayUsername: ctx?.body?.displayUsername,
    })

    if (!parsed.success) {
      // FIXME: temp gambiarra
      const errorCodes = getErrorCodes(parsed.error)

      if (errorCodes.length > 0) {
        throw new APIError("BAD_REQUEST", { code: errorCodes[0] })
      }
    }
  }

  if (ctx.path === "/sign-in/username") {
    const parsed = signInSchema.safeParse({
      username: ctx?.body?.username,
      password: ctx?.body?.password,
    })

    if (!parsed.success) {
      // FIXME: temp gambiarra
      const errorCodes = getErrorCodes(parsed.error)

      if (errorCodes.length > 0) {
        throw new APIError("BAD_REQUEST", { code: errorCodes[0] })
      }
    }
  }
})

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    minPasswordLength: 8,
    maxPasswordLength: 32,
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24h
    updateAge: 60 * 60 * 12, // 12h
    freshAge: 60 * 60 * 24, // 24h
  },
  rateLimit: {
    storage: "database",
  },
  plugins: [
    nextCookies(),
    username({
      minUsernameLength: 2,
      maxUsernameLength: 32,
      usernameValidator: username => /^[a-zA-Z0-9_]{2,32}$/.test(username),
      usernameNormalization: username => username.trim(),
      displayUsernameValidator: displayUsername =>
        /^[a-zA-Z0-9_ ]{2,32}$/.test(displayUsername),
      displayUsernameNormalization: displayUsername => displayUsername.trim(),
    }),
  ],
  hooks: {
    before: beforeHook,
  },
  telemetry: {
    enabled: false,
  },
})
