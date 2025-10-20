"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import type z from "zod"
import BadgesSelector from "@/components/badges-selector"
import { ComboboxVisibility } from "@/components/combobox-visibility"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/use-debounce"
import useProjectEditorStore from "@/store/project-edtor-store"
import type { ProjectType } from "@/utils/db"
import { projectUpdateSchema } from "@/utils/validations"

export default function AsideContent({ project }: { project: ProjectType }) {
  const setProject = useProjectEditorStore(state => state.setProject)

  const form = useForm<z.infer<typeof projectUpdateSchema>>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      badges: project.badges,
      githubUrl: project.githubUrl,
      shortDescription: project.shortDescription,
      slug: project.slug,
      title: project.title,
      visibility: project.visibility,
    },
  })

  const watchedValues = form.watch()
  const isMounted = useRef(false)
  const debouncedStringValues = useDebounce(JSON.stringify(watchedValues), 500)

  useEffect(() => {
    if (isMounted.current) {
      handleChange(JSON.parse(debouncedStringValues))
    } else {
      isMounted.current = true
    }
  }, [debouncedStringValues])

  function handleChange(data: z.infer<typeof projectUpdateSchema>) {
    setProject({
      ...project,
      ...data,
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <ComboboxVisibility
                  visibility={field.value}
                  onVisibilityChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-16"
                  {...field}
                  placeholder="Short description"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://github.com/abc/xyz"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="badges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Badges</FormLabel>
              <FormControl>
                <BadgesSelector value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
