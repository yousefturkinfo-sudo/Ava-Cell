import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Glass Container */}
            <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-2xl shadow-2xl">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-xs text-zinc-500">Join the Institutional RWA Network</p>
                </div>
                <SignUp
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: '#f97316',
                            colorBackground: 'transparent',
                            colorText: 'white',
                            colorInputBackground: 'rgba(255,255,255,0.05)',
                            colorInputText: 'white',
                            borderRadius: '0.5rem',
                        },
                        elements: {
                            card: "shadow-none bg-transparent",
                            rootBox: "w-full",
                            formFieldInput: "border-white/10 focus:border-orange-500 transition-colors",
                            footer: "hidden"
                        }
                    }}
                />
            </div>
        </div>
    );
}
