export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-zinc-500">Page not found</p>
                <a href="/dashboard" className="text-orange-500 hover:text-orange-400">Return Home</a>
            </div>
        </div>
    )
}
