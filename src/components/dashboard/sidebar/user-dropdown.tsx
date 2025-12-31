"use client"

import {
  ChevronRightIcon,
  LogOut,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
} from "lucide-react"
import { redirect } from "next/navigation"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"

type Session = typeof auth.$Infer.Session

export default function UserDropdown({ user }: { user: Session["user"] }) {
  const { setTheme } = useTheme()

  async function handleSignOut() {
    const response = await authClient.signOut()

    if (response.data?.success) {
      redirect("/sign-in")
    }
  }

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            {user.image && (
              <AvatarImage src={user.image} alt={`${user.name}'s avatar`} />
            )}
            <AvatarFallback className="rounded-lg">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate">{user.name}</span>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <DropdownMenuItem>
            <PaletteIcon />
            <div className="w-full flex justify-between">
              Theme
              <ChevronRightIcon className="size-4" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="right" sideOffset={4}>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <SunIcon />
            Light
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <MoonIcon />
            Dark
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTheme("system")}>
            <MonitorIcon />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </>
  )
}
