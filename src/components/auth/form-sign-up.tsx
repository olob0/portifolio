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
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ServerError } from "@/lib/auth-client"
import { signUpSchema } from "@/utils/validations"

interface FormSignUpProps {
  onSubmit: (data: z.infer<typeof signUpSchema>) => void
  serverError: ServerError | null
  isLoading?: boolean
}

export function FormSignUp({
  onSubmit,
  serverError,
  isLoading,
}: FormSignUpProps) {
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      displayUsername: "",
    },
  })

  useEffect(() => {
    if (serverError) {
      form.clearErrors()
      setServerErrorMessage(serverError.message)
    }
  }, [serverError])

  function handleSubmit(callback: FormSignUpProps["onSubmit"]) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setServerErrorMessage(null)

      const parsed = signUpSchema.safeParse(form.getValues())

      if (!parsed.success) {
        const errors = z.flattenError(parsed.error).fieldErrors

        if (errors.username)
          form.setError("username", { message: "invalid username" })
        if (errors.password)
          form.setError("password", { message: "invalid password" })
        if (errors.email) form.setError("email", { message: "invalid email" })
        if (errors.name) form.setError("name", { message: "invalid name" })
        if (errors.displayUsername)
          form.setError("displayUsername", {
            message: "invalid display username",
          })

        return
      }

      form.clearErrors()

      if (isLoading) return

      callback(parsed.data)
    }
  }

  return (
    <Form {...form}>
      <div className="border-2 p-4 rounded-2xl min-w-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign up</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ScrollArea className="h-75 mb-4">
            <div className="space-y-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Codes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jonh@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john_codes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder="The John Codes" {...field} />
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
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>

          <FormMessage className="text-center">
            {serverErrorMessage}
          </FormMessage>

          <Link href="/sign-in" className="text-center block hover:underline">
            &larr; Sign in
          </Link>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </div>
    </Form>
  )
}
