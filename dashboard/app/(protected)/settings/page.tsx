"use client"

export default function SettingsPage() {
    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Organization Settings</h1>
                <p className="text-muted-foreground">Manage your workspace and compliance policies.</p>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-semibold mb-4">General Info</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Workspace Name</label>
                            <input type="text" className="h-10 px-3 rounded-md bg-muted/50 border border-border" defaultValue="Ava//Cell Demo Org" />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-semibold mb-4">Compliance Policy</h3>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 mb-4">
                        <div>
                            <p className="font-medium">Strict KYC Enforcement</p>
                            <p className="text-xs text-muted-foreground">Reject transactions from unverified wallets</p>
                        </div>
                        <div className="w-10 h-6 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
