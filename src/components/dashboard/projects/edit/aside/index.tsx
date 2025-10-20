"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import useProjectEditorStore from "@/store/project-edtor-store"
import Content from "./content"

export default function Aside({
  className,
  ...rest
}: React.ComponentProps<"aside">) {
  const project = useProjectEditorStore(state => state.project)

  return (
    <aside
      className={cn("bg-sidebar text-sidebar-foreground p-2", className)}
      {...rest}
    >
      {project && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Content project={project} />
          </motion.div>
        </AnimatePresence>
      )}

      {!project &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full mb-2" />
        ))}
    </aside>
  )
}
