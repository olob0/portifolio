"use client"

import { useEffect, useState } from "react"
import icons from "simple-icons/icons.json"
import { type Option, VirtualizedMultiSelect } from "./ui/multi-select"

interface badgesSelectorProps {
  value?: string[]
  onChange?: (value: string[]) => void
}

export default function BadgesSelector({
  value,
  onChange,
}: badgesSelectorProps) {
  const [badges, setBadges] = useState<Option[]>([])

  useEffect(() => {
    ;(async () => {
      setBadges(
        icons.map(icon => ({
          value: icon.slug,
          icon: icon.slug,
          label: icon.title,
          color: `#${icon.hex}`,
        }))
      )
    })()
  }, [])

  return (
    <VirtualizedMultiSelect
      options={badges}
      onValueChange={onChange}
      value={value}
    />
  )
}
