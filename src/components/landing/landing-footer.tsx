'use client';

import Link from 'next/link';
import Image from 'next/image';

export function LandingFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="CitraChain Logo"
                                width={50}
                                height={50}
                            />
                            <Image
                                src="/title.png"
                                alt="CitraChain"
                                width={165}
                                height={33}
                                className="brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Bringing transparency to agricultural supply chains with blockchain technology.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Product</h3>
                        <ul className="space-y-3">
                            <li><Link href="/marketplace" className="hover:text-orange-400 transition-colors">Marketplace</Link></li>
                            <li><Link href="/farmer" className="hover:text-orange-400 transition-colors">Farmer Dashboard</Link></li>
                            <li><Link href="/verify" className="hover:text-orange-400 transition-colors">Verify Batch</Link></li>
                        </ul>
                    </div>

                    {/* Learn Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Learn</h3>
                        <ul className="space-y-3">
                            <li><a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a></li>
                            <li><a href="#trust" className="hover:text-orange-400 transition-colors">Trust & Transparency</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    {/* Connect Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Connect</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-orange-400 transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-orange-400 transition-colors">Twitter</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 CitraChain. Built on blockchain for the real world.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
