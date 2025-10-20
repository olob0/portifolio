import { eq, inArray } from "drizzle-orm"
import { BadgesTable, ProjectAccessTable, ProjectsTable } from "@/db/schema"
import type { dbType } from "@/lib/db"
import { slugify } from "./tools"

export enum ProjectVisibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  UNLISTED = "UNLISTED",
}

type ExtraProjectType = {
  badges: string[]
  visibility: ProjectVisibility
}

export type ProjectType = typeof ProjectsTable.$inferSelect & ExtraProjectType

export type InsertProjectType = Omit<
  typeof ProjectsTable.$inferInsert & ExtraProjectType,
  "id" | "createdAt"
>

export async function insertProject(db: dbType, project: InsertProjectType) {
  const { badges, visibility, ...data } = project

  data.slug = slugify(data.slug)

  return await db.transaction(async tx => {
    const [_project] = await tx.insert(ProjectsTable).values(data).returning()

    await tx.insert(ProjectAccessTable).values({
      projectId: _project.id,
      visibility,
    })

    if (badges.length) {
      await tx.insert(BadgesTable).values(
        badges.map(badge_id => ({
          projectId: _project.id,
          badge_id: badge_id,
        }))
      )
    }

    return { ..._project, badges, visibility }
  })
}

export async function listProjects(
  db: dbType,
  visibility: ProjectVisibility[] = [ProjectVisibility.PUBLIC]
) {
  const projects = await db.query.ProjectsTable.findMany({
    columns: {
      id: true,
      shortDescription: true,
      slug: true,
      title: true,
    },
    with: {
      badges: true,
      access: true,
    },

    where: projectsTable =>
      inArray(
        projectsTable.id,

        db
          .select({ projectId: ProjectAccessTable.projectId })
          .from(ProjectAccessTable)
          .where(inArray(ProjectAccessTable.visibility, visibility))
      ),
  })

  return projects.map(project => {
    const { badges, access, ...data } = project

    return {
      ...data,
      visibility: access.visibility,
      badges: badges.map(badge => badge.badge_id),
    }
  })
}

export async function editProject(
  db: dbType,
  projectId: string,
  project: Partial<InsertProjectType>
) {
  const { badges, visibility, ...data } = project

  return await db.transaction(async tx => {
    if (data && Object.keys(data).length) {
      await tx
        .update(ProjectsTable)
        .set(data)
        .where(eq(ProjectsTable.id, projectId))
    }

    if (visibility) {
      await tx
        .update(ProjectAccessTable)
        .set({ visibility })
        .where(eq(ProjectAccessTable.projectId, projectId))
    }

    if (badges) {
      await tx.delete(BadgesTable).where(eq(BadgesTable.projectId, projectId))

      await tx
        .insert(BadgesTable)
        .values(badges.map(badge => ({ projectId, badge_id: badge })))
    }
  })
}

async function _getProject(db: dbType, method: "id" | "slug", data: string) {
  let queryMethod: ReturnType<typeof eq> | undefined

  if (method === "id") {
    queryMethod = eq(ProjectsTable.id, data)
  }

  if (method === "slug") {
    queryMethod = eq(ProjectsTable.slug, data)
  }

  if (!queryMethod) return undefined

  const result = await db.query.ProjectsTable.findFirst({
    with: {
      badges: true,
      access: true,
    },
    where: queryMethod,
  })

  if (!result) return undefined

  const { access, ...project } = result

  return {
    ...project,
    badges: project.badges.map(badge => badge.badge_id),
    visibility: access.visibility,
  } as ProjectType
}

export async function getProjectById(db: dbType, id: string) {
  return await _getProject(db, "id", id)
}

export async function getProjectBySlug(db: dbType, slug: string) {
  return await _getProject(db, "slug", slug)
}

export async function deleteProject(db: dbType, projectId: string) {
  return await db.delete(ProjectsTable).where(eq(ProjectsTable.id, projectId))
}
