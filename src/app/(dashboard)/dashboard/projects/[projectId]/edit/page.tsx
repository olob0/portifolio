import ProjectEditor from "@/components/dashboard/projects/edit"
import Aside from "@/components/dashboard/projects/edit/aside"
import Header from "@/components/dashboard/projects/edit/header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from "@/lib/db"
import { getProjectById } from "@/utils/db"

import { projectIdSchema } from "@/utils/validations"

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  const parsed = projectIdSchema.safeParse({
    id: projectId,
  })

  if (!parsed.success) {
    return // 404
  }

  const project = await getProjectById(db, parsed.data.id)

  if (!project) return // 404

  return (
    <div className="h-screen bg-sidebar p-2">
      <div className="h-16 max-h-16 bg-sidebar">
        <Header className="-translate-1" />
      </div>

      <main className="flex h-[calc(100%-4rem)]">
        <Aside className="w-[16rem] -translate-1" />

        <div className="w-full max-w-[calc(100%-16rem)] p-2 bg-background rounded-2xl flex justify-center">
          <div className="w-[1px] h-auto bg-border/50" />

          <ScrollArea className="w-full h-full max-w-[65ch]">
            <ProjectEditor project={project} />
          </ScrollArea>

          <div className="w-[1px] h-auto bg-border/50" />
        </div>
      </main>
    </div>
  )
}
