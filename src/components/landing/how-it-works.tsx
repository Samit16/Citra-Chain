'use client';

import { Package, ShoppingCart, Shield } from 'lucide-react';

const steps = [
    {
        icon: Package,
        title: "Farmers List Harvest",
        description: "Farmers create batches with quantity, price, and location. Every listing is recorded on-chain.",
        forRole: "Farmer",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: ShoppingCart,
        title: "Buyers Browse & Purchase",
        description: "Buyers discover verified produce, view origin details, and purchase directly from farmers.",
        forRole: "Buyer",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Shield,
        title: "Public Verification",
        description: "Every batch can be verified by anyone using QR codes. Full transparency, zero trust required.",
        forRole: "Everyone",
        color: "from-orange-500 to-amber-500"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                        Three simple steps. Complete transparency. No intermediaries.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:border-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-xl">
                                {index + 1}
                            </div>

                            {/* Icon */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                        {step.forRole}
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 font-semibold">
                        Built on blockchain. Designed for real people.
                    </p>
                </div>
            </div>
        </section>
    );
}
