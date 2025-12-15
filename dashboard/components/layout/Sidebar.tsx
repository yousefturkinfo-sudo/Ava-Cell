"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Globe, Layers, ArrowLeftRight, Settings, Box } from "lucide-react"
import { cn } from "@/lib/utils"
// import { UserButton, OrganizationSwitcher } from "@clerk/nextjs"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/globe", label: "Live Globe", icon: Globe },
    { href: "/assets", label: "Assets", icon: Box },
    { href: "/flows", label: "Capital Flows", icon: ArrowLeftRight },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50">
            <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight">ava//cell</span>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border bg-muted/10">
                <div className="flex items-center gap-3">
                    {/* Clerk components will go here. Commented out to prevent crash if keys missing */}
                    <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
                    <div className="space-y-1">
                        <div className="h-3 w-20 bg-secondary rounded animate-pulse" />
                        <div className="h-2 w-16 bg-secondary/50 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </aside>
    )
}
