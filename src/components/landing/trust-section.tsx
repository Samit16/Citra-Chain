'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const features = [
    "Proof of origin for every batch",
    "Fair pricing, no middlemen",
    "QR code verification",
    "Immutable transaction history",
    "Direct farmer-to-buyer connection",
    "Public supply chain transparency"
];

export function TrustSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-orange-50 via-amber-50/30 to-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-amber-200/20 to-transparent rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Visual */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative z-10">
                            <Image
                                src="/images/trust-visual.png"
                                alt="Blockchain Trust Network"
                                width={600}
                                height={600}
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-orange-100 max-w-xs animate-float">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-1">
                                        Verified On-Chain
                                    </p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Every transaction is cryptographically secured and publicly auditable
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold uppercase tracking-wider">
                                Trust & Transparency
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                                This is about
                                <span className="block mt-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    food, trust, and farmers.
                                </span>
                            </h2>
                            <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                Not abstract DeFi protocols. CitraChain uses blockchain to solve real-world problems
                                in agricultural supply chains—bringing transparency to every harvest.
                            </p>
                        </div>

                        {/* Feature List */}
                        <div className="grid gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-gray-900 font-semibold">
                                        {feature}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <p className="text-md text-gray-600 italic">
                                "Every orange tells a story. CitraChain makes sure it's a true one."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
