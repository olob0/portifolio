"use client"

import type { Row } from "@tanstack/react-table"
import { LucidePencil } from "lucide-react"
import Link from "next/link"
import type { ColumnType } from "../table-columns"

export default function Title({ row }: { row: Row<ColumnType> }) {
  return (
    <Link
      href={`/dashboard/projects/${row.original.id}/edit`}
      className="flex items-center gap-4 hover:underline hover:stroke-muted-foreground underline-offset-8 stroke-muted-foreground/50"
    >
      {row.original.title}
      <LucidePencil className="h-4 w-4 stroke-inherit" />
    </Link>
  )
}
