import { test as baseTest } from "vitest"
import { authClient } from "@/lib/auth-client"

interface CustomTestContext {
  authClient: typeof authClient
}

export const test = baseTest.extend<CustomTestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: required by vitest
  authClient: async ({}, use) => {
    const client = authClient

    await use(client)
  },
})
