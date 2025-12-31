"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { ServerError } from "@/lib/auth-client"
import { signInSchema } from "@/utils/validations"

interface FormSignInProps {
  onSubmit: (data: z.infer<typeof signInSchema>) => void
  serverError: ServerError | null
  isLoading?: boolean
}

export function FormSignIn({
  onSubmit,
  serverError,
  isLoading,
}: FormSignInProps) {
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    if (serverError) {
      form.clearErrors()
      setServerErrorMessage(serverError.message)
    }
  }, [serverError])

  function handleSubmit(callback: FormSignInProps["onSubmit"]) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setServerErrorMessage(null)

      const parsed = signInSchema.safeParse(form.getValues())

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error).fieldErrors

        if (errors.username)
          form.setError("username", { message: "invalid username" })
        if (errors.password)
          form.setError("password", { message: "invalid password" })

        return
      }

      form.clearErrors()

      if (isLoading) return

      callback(parsed.data)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border-2 p-4 rounded-2xl min-w-100 max-h-[60%] overflow-y-auto"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign in</h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormMessage className="text-center">{serverErrorMessage}</FormMessage>

        <Link href="/sign-up" className="text-center block hover:underline">
          Sign up &rarr;
        </Link>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </form>
    </Form>
  )
}
