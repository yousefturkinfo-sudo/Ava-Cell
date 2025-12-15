"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        const hasSeenParams = localStorage.getItem('ava_onboarding_v1')
        if (!hasSeenParams) {
            setIsOpen(true)
        }
    }, [])

    const handleDismiss = () => {
        setIsOpen(false)
        localStorage.setItem('ava_onboarding_v1', 'true')
    }

    const steps = [
        {
            title: "Welcome to Ava//Cell",
            desc: "The Institutional-Grade RWA Compliance Layer on Avalanche.",
            icon: "simple-icons:avalanche",
            color: "text-red-500"
        },
        {
            title: "Real-Time Sentinel",
            desc: "Every transaction is checked against our AI Risk Engine before settlement. You are safer here.",
            icon: "lucide:shield-check",
            color: "text-orange-500"
        },
        {
            title: "Minting Assets",
            desc: "Use the 'Asset Management' panel to fractionally mint Real Estate or Treasury tokens.",
            icon: "lucide:coins",
            color: "text-indigo-500"
        },
        {
            title: "Gas Tokens ($CELL)",
            desc: "This is a custom Subnet. You need $CELL tokens to pay for gas, not AVAX.",
            icon: "lucide:fuel",
            color: "text-green-500"
        }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
                    >
                        {/* Progress Bar */}
                        <div className="h-1 bg-white/5 w-full flex">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-full flex-1 transition-colors duration-300 ${i <= step ? 'bg-orange-500' : 'bg-transparent'}`}
                                />
                            ))}
                        </div>

                        <div className="p-8 text-center space-y-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Icon icon={steps[step].icon} width="32" className={steps[step].color} />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-display font-bold text-white">{steps[step].title}</h2>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {steps[step].desc}
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                {step < steps.length - 1 ? (
                                    <>
                                        <button
                                            onClick={handleDismiss}
                                            className="flex-1 px-4 py-3 text-zinc-500 text-sm font-medium hover:text-white transition-colors"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            onClick={() => setStep(s => s + 1)}
                                            className="flex-1 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleDismiss}
                                        className="w-full px-4 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                                    >
                                        Get Started
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
