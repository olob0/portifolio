import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        <div
          data-slot="skeleton"
          className={cn("bg-accent animate-pulse rounded-md", className)}
          {...props}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export { Skeleton }
