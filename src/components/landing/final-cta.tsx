'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
    return (
        <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    {/* Main Heading */}
                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                            Building Trust in
                            <span className="block mt-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                Every Harvest.
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium max-w-2xl mx-auto">
                            Join a transparent agricultural marketplace designed for farmers, buyers,
                            and conscious consumers.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link
                            href="/marketplace"
                            className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                        >
                            Enter Marketplace
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link
                            href="/farmer"
                            className="group relative px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-black text-lg rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                        >
                            Farmer Dashboard
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-8 pt-16 border-t border-white/10">
                        <div className="space-y-2">
                            <p className="text-4xl md:text-5xl font-black text-white">100%</p>
                            <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Transparent</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl md:text-5xl font-black text-white">0</p>
                            <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Middlemen</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                ∞
                            </p>
                            <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Trust Built</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
