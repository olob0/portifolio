import { describe, expect } from "vitest"

import { test } from "./fixtures"

const testUser = {
  username: "testusername",
  password: "test123##",
  email: "test@test.com",
  name: "Test User",
  displayUsername: "Cool Test User",
}

describe("auth", () => {
  test("invalid email (validation)", async ({ authClient }) => {
    const { data, error } = await authClient.signIn.email({
      email: "thisisnotanemail",
      password: testUser.password,
    })

    expect(error?.code).toBe("INVALID_EMAIL")
    expect(data).toBeNull()
  })

  test("invalid password (validation)", async ({ authClient }) => {
    const { data, error } = await authClient.signIn.username({
      username: testUser.username,
      password: "password",
    })

    expect(error?.code).toBe("INVALID_PASSWORD")
    expect(data).toBeNull()
  })

  test("invalid name (validation sign up)", async ({ authClient }) => {
    const { data, error } = await authClient.signUp.email({
      ...testUser,
      name: "123",
    })

    expect(error?.code).toBe("INVALID_NAME")
    expect(data).toBeNull()
  })

  test("invalid username (validation sign up)", async ({ authClient }) => {
    const { data, error } = await authClient.signUp.email({
      ...testUser,
      username: "1",
    })

    expect(error?.code).toBe("INVALID_USERNAME")
    expect(data).toBeNull()
  })

  test("invalid display name (validation sign up)", async ({ authClient }) => {
    const { data, error } = await authClient.signUp.email({
      ...testUser,
      displayUsername: "1",
    })

    expect(error?.code).toBe("INVALID_DISPLAY_USERNAME")
    expect(data).toBeNull()
  })

  test("wrong password (with username)", async ({ authClient }) => {
    const { data, error } = await authClient.signIn.username({
      username: testUser.username,
      password: "dev123###",
    })

    expect(error?.code).toBe("INVALID_USERNAME_OR_PASSWORD")
    expect(data).toBeNull()
  })

  test("wrong password (with email)", async ({ authClient }) => {
    const { data, error } = await authClient.signIn.email({
      email: testUser.email,
      password: "dev123###",
    })

    expect(error?.code).toBe("INVALID_EMAIL_OR_PASSWORD")
    expect(data).toBeNull()
  })

  test("sign up", async ({ authClient }) => {
    const usernameAvaliableData = await authClient.isUsernameAvailable({
      username: testUser.username,
    })

    if (!usernameAvaliableData.data?.available) {
      return
    }

    const { data, error } = await authClient.signUp.email(testUser)

    expect(error).toBeNull()
    expect(data?.user).toBeDefined()
    expect(data?.user.email).toBe(testUser.email)
  })

  test("sign up username already taken", async ({ authClient }) => {
    const { data, error } = await authClient.signUp.email(testUser)

    expect(error?.code).toBe("USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER")
    expect(data).toBeNull()
  })

  test("sign in", async ({ authClient }) => {
    const { data, error } = await authClient.signIn.username({
      username: testUser.username,
      password: testUser.password,
    })

    expect(error).toBeNull()
    expect(data?.user).toBeDefined()
    expect(data?.user.email).toBe(testUser.email)
  })

  test("sign out", async ({ authClient }) => {
    const { data, error } = await authClient.signOut()

    expect(error).toBeNull()
    expect(data?.success).toBe(true)
  })
})
