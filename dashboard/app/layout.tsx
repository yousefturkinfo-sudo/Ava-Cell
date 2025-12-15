import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ava//Cell SaaS',
    description: 'AI-Native Regulated Asset L1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" className="dark">
                <body className={inter.className} suppressHydrationWarning>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
