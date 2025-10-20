"use client"

import { useMutation } from "@tanstack/react-query"
import { isEqual } from "lodash"
import { LucideArrowLeft, LucideSave } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import VisibilityBadge from "@/components/visibility-badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { updateProject } from "@/http/api"
import { cn } from "@/lib/utils"
import useProjectEditorStore from "@/store/project-edtor-store"
import type { ProjectType } from "@/utils/db"
import { projectUpdateSchema } from "@/utils/validations"

export default function Header({
  className,
  ...rest
}: React.ComponentProps<"header">) {
  const project = useProjectEditorStore(state => state.project)
  const setProject = useProjectEditorStore(state => state.setProject)

  const [originalProject, setOriginalProject] = useState<ProjectType | null>(
    null
  )

  const isMobile = useIsMobile()

  useEffect(() => {
    if (project && !originalProject) {
      setOriginalProject(project)
    }
  }, [project, originalProject])

  const hasUnsavedChanges =
    originalProject && project ? !isEqual(originalProject, project) : false

  const mutation = useMutation({
    mutationFn: (data: ProjectType) => updateProject(data.id, data),
    onSuccess(_data, variables, _context) {
      setProject(variables)
      setOriginalProject(variables)

      toast.success("Project saved!", {
        duration: 2000,
        richColors: true,
      })
    },
    onError: error => {
      toast.error("Error saving project!", {
        description: error.message,
        richColors: true,
        duration: 5000,
      })
    },
  })

  function handleSave(data: ProjectType) {
    const parsed = projectUpdateSchema.safeParse(data)
    if (!parsed.success) {
      toast.error("Invalid data!", {
        description: "Please check the project fields.",
        richColors: true,
      })
      return
    }
    mutation.mutate(data)
  }

  const isDataValid = project
    ? projectUpdateSchema.safeParse(project).success
    : false

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center px-4 space-x-4",
        className
      )}
      {...rest}
    >
      <Link href="/dashboard/projects">
        <LucideArrowLeft className="h-4 w-4" />
      </Link>

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-6"
      />

      {!project && (
        <>
          <Skeleton className="h-8 w-[20%]" />
          <Skeleton className="h-8 w-[10%]" />
          <Skeleton className="h-8 w-8" />
        </>
      )}

      {project && (
        <>
          <h1 className="text-lg font-semibold truncate max-w-[20%]">
            {project.title}
          </h1>

          <VisibilityBadge visibility={project.visibility} />

          <Button
            variant="ghost"
            onClick={() => handleSave(project)}
            disabled={!hasUnsavedChanges || !isDataValid || mutation.isPending}
          >
            <LucideSave className="h-6 w-6" />

            {hasUnsavedChanges && !isMobile && (
              <span className="ml-2 text-sm text-muted-foreground">
                Unsaved changes
              </span>
            )}
          </Button>
        </>
      )}
    </header>
  )
}
