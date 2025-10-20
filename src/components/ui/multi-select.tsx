"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { AnimatePresence, motion } from "framer-motion"
import { Check, LucidePlus, XCircle } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import FetchSimpleIcon from "../fetch-simple-icon"

export type Option = {
  value: string
  label: string
  icon?: string
  color?: string
}

interface VirtualizedCommandProps {
  height: string
  options: Option[]
  placeholder: string
  selectedValues: string[]
  onToggleOption: (option: string) => void
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedValues,
  onToggleOption,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options)
  const [searchValue, setSearchValue] = React.useState("")

  const parentRef = React.useRef(null)

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  const virtualOptions = virtualizer.getVirtualItems()

  const handleSearch = (search: string) => {
    setSearchValue(search)
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase() ?? [])
      )
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const focusedIndex =
        virtualOptions.find(
          v => v.index === Math.floor(virtualizer.scrollOffset || 0 / 35)
        )?.index || 0
      if (filteredOptions[focusedIndex]) {
        onToggleOption(filteredOptions[focusedIndex].value)
      }
    }
  }

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput
        onValueChange={handleSearch}
        value={searchValue}
        placeholder={placeholder}
      />
      <CommandList ref={parentRef} style={{ height, width: "100%" }}>
        {filteredOptions.length > 0 ? (
          <div
            className="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualOptions.map(virtualOption => {
              const option = filteredOptions[virtualOption.index]
              const isSelected = selectedValues.includes(option.value)
              return (
                <CommandItem
                  key={option.value}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  value={option.value}
                  onSelect={() => onToggleOption(option.value)}
                >
                  {option.icon && (
                    <FetchSimpleIcon
                      slug={option.icon}
                      style={{ fill: option.color }}
                    />
                  )}
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )
            })}
          </div>
        ) : (
          <CommandEmpty>No item found.</CommandEmpty>
        )}
      </CommandList>
    </Command>
  )
}

interface VirtualizedMultiSelectProps {
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  width?: string
  height?: string
  maxCount?: number
  onValueChange?: (values: string[]) => void
  value?: string[]
}

export function VirtualizedMultiSelect({
  options,
  placeholder = "Add",
  searchPlaceholder = "Search...",
  width = "100%",
  height = "300px",
  maxCount = 5,
  onValueChange,
  value = [],
}: VirtualizedMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleToggleOption = (selectedValue: string) => {
    const newSelectedValues = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : [...value, selectedValue]

    onValueChange?.(newSelectedValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap items-center gap-1 flex-1">
          <AnimatePresence>
            {value.length > 0 && (
              <>
                {options
                  .filter(option =>
                    value.slice(0, maxCount).includes(option.value)
                  )
                  .map(item => (
                    <motion.div
                      key={item.value}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Badge
                        key={item.value}
                        variant="secondary"
                        className="flex items-center py-1 px-2 text-sm gap-2 select-none"
                      >
                        {item.icon && (
                          <FetchSimpleIcon
                            slug={item.icon}
                            className="h-4 w-4"
                            style={{ fill: item.color }}
                          />
                        )}

                        {item.label}

                        <button
                          type="button"
                          className="cursor-pointer pointer-events-auto"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleToggleOption(item.value)
                          }}
                        >
                          <XCircle className="h-4 w-4 transition-colors hover:stroke-red-400" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}

                {value.length > maxCount && (
                  <Badge
                    variant="secondary"
                    className="py-1 px-2 text-sm gap-2"
                  >
                    + {value.length - maxCount}
                  </Badge>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {value.length === 0 ? placeholder : null}

            <LucidePlus className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="p-0" style={{ width }}>
        <VirtualizedCommand
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedValues={value}
          onToggleOption={handleToggleOption}
        />
      </PopoverContent>
    </Popover>
  )
}
