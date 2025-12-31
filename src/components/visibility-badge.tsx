"use client"

import { cn } from "@/lib/utils"
import { ProjectVisibility } from "@/utils/db"

export default function VisibilityBadge({
  visibility,
}: {
  visibility: ProjectVisibility
}) {
  return (
    <div
      className={cn(
        "flex items-center border-2 py-px px-2 rounded-full font-mono text-sm tracking-wider",
        visibility === ProjectVisibility.PUBLIC &&
          "dark:bg-green-950/50 bg-green-100",
        visibility === ProjectVisibility.PRIVATE &&
          "dark:bg-red-950/50 bg-red-100",
        visibility === ProjectVisibility.UNLISTED &&
          "dark:bg-yellow-950/50 bg-yellow-100"
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full mr-2",
          visibility === ProjectVisibility.PUBLIC && "bg-green-500",
          visibility === ProjectVisibility.PRIVATE && "bg-red-500",
          visibility === ProjectVisibility.UNLISTED && "bg-yellow-500"
        )}
      />
      {visibility}
    </div>
  )
}
