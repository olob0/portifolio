"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  type CreateProjectType,
  createProject,
  type ErrorResponse,
} from "@/http/api"
import { ProjectVisibility } from "@/utils/db"
import { slugify } from "@/utils/tools"
import { projectInsertSchema } from "@/utils/validations"

export function CreateProjectDialog() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof projectInsertSchema>>({
    resolver: zodResolver(projectInsertSchema),
    defaultValues: {
      badges: [],
      visibility: ProjectVisibility.PRIVATE,
      slug: "",
      title: "",
    },
  })

  const titleValue = form.watch("title")
  const { formState } = form

  const mutation = useMutation<
    CreateProjectType,
    ErrorResponse,
    z.infer<typeof projectInsertSchema>
  >({
    mutationFn: createProject,
    onSuccess: data => {
      form.clearErrors()

      toast.success("Project created!", {
        duration: 2000,
        richColors: true,
      })

      router.push(`/dashboard/projects/${data.data.id}/edit`)
      setLoading(false)
    },
    onError: error => {
      setLoading(false)

      if (error.code === "PROJECT_SLUG_ALREADY_EXISTS") {
        form.setError("slug", { message: "This identifier is already taken" })
        return
      }

      toast.error("Error creating project!", {
        duration: 5000,
        description: `Error: ${error.message}`,
        richColors: true,
      })
    },
  })

  useEffect(() => {
    if (!formState.dirtyFields.slug) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true })
    }
  }, [titleValue, formState.dirtyFields.slug, form.setValue])

  function onSubmit(data: z.infer<typeof projectInsertSchema>) {
    setLoading(true)
    mutation.mutate(data)
  }
  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>Create a new project</DialogTitle>
        <DialogDescription>
          Fill the form below to create a new project
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input placeholder="My cool project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project identifier</FormLabel>
                <FormControl>
                  <Input
                    placeholder="my-cool-project"
                    {...field}
                    onChange={event => {
                      const value = event.target.value
                      const sanitizedValue = value.replace(/[^a-z0-9-]/g, "")
                      field.onChange(sanitizedValue)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending || !formState.isValid || loading}
              isLoading={mutation.isPending || loading}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
