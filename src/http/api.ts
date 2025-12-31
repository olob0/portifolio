import type { z } from "zod"
import type { ProjectType } from "@/utils/db"
import type { projectInsertSchema } from "@/utils/validations"

type SuccessResponse<T> = {
  success: true
  data: T
}

export type ErrorResponse = {
  success: false
  code: string
  message: string
}

type ApiResponse<T> = SuccessResponse<T>

type ApiResponseCreateProject = {
  id: ProjectType["id"]
}

export type CreateProjectType = ApiResponse<ApiResponseCreateProject>
export type ListProjectsType = ApiResponse<ProjectType[]>
export type GetProjectType = ApiResponse<ProjectType>

export async function getProjects() {
  const response = await fetch("/api/projects", {
    method: "GET",
  })

  const responseData = await response.json()

  if (!response.ok || !responseData.success) {
    throw responseData as ErrorResponse
  }

  return responseData as ListProjectsType
}

export async function getProject(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "GET",
  })

  const responseData = await response.json()

  if (!response.ok || !responseData.success) {
    throw responseData as ErrorResponse
  }

  return responseData as GetProjectType
}

export async function updateProject(projectId: string, project: ProjectType) {
  const { createdAt, id, ...data } = project

  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw response
  }

  return response
}

export async function deleteProject(projectId: string): Promise<void> {
  await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
  })
}

export async function createProject(
  project: z.infer<typeof projectInsertSchema>
) {
  const response = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  })

  const responseData = await response.json()

  if (!response.ok || !responseData.success) {
    throw responseData as ErrorResponse
  }

  return responseData as CreateProjectType
}
