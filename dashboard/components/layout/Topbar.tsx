"use client"

import { Bell, Search, Calendar } from "lucide-react"

export function Topbar() {
    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Oct 24, 2025 - Oct 31, 2025</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search global assets..."
                        className="h-9 w-64 pl-9 rounded-full bg-muted/50 border-none text-sm focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                    />
                </div>

                <button className="relative p-2 rounded-full hover:bg-muted/50 transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                </button>

                <div className="w-px h-6 bg-border" />

                {/* Clerk UserButton placeholder */}
                <div className="w-8 h-8 rounded-full bg-secondary border border-border" />
            </div>
        </header>
    )
}
