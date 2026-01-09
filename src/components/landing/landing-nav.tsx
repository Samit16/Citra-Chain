'use client';

import Link from 'next/link';

export function LandingNav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-200 group-hover:shadow-orange-300 transition-shadow">
                            <span className="text-white text-xl font-bold">C</span>
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">CitraChain</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/marketplace"
                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                        >
                            Marketplace
                        </Link>
                        <Link
                            href="/verify"
                            className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                        >
                            Verify Batch
                        </Link>
                        <Link
                            href="/farmer"
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-shadow"
                        >
                            Launch App
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <Link
                        href="/farmer"
                        className="md:hidden px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm"
                    >
                        Launch
                    </Link>
                </div>
            </div>
        </nav>
    );
}
