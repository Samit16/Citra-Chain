'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <>
      {/* Load Spline Viewer Script */}
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.12.32/build/spline-viewer.js"
        strategy="lazyOnload"
      />

      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50/30">
        {/* Layer 1: Base Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white/90 to-amber-50/40 z-0" />

        {/* Layer 2: MONUMENTAL CHAIN - The Visual Backbone */}
        <div
          className="absolute inset-0 z-[1] overflow-visible chain-container"
          style={{
            transform: 'scale(2.2) translateX(-15%) translateY(10%) rotate(-8deg)',
            transformOrigin: 'bottom left',
          }}
        >
          <spline-viewer
            url="https://prod.spline.design/RzgwFZ7Wfs52rrcc/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Layer 3: Atmospheric Depth & Text Protection */}
        {/* Subtle blur overlay where chain passes behind text for readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white/20 via-transparent to-orange-50/10 backdrop-blur-[0.5px]" />

        {/* Layer 4: Decorative Glows - Softer now that chain is dominant */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-radial from-orange-200/20 via-orange-100/10 to-transparent rounded-full blur-3xl z-[3]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-amber-200/15 via-yellow-100/5 to-transparent rounded-full blur-3xl z-[3]" />

        {/* Layer 5: Content Container - Above everything */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src="/logo.png"
                  alt="CitraChain Logo"
                  width={85}
                  height={85}
                  className="animate-subtle-float drop-shadow-lg"
                />
                <Image
                  src="/title.png"
                  alt="CitraChain"
                  width={260}
                  height={52}
                  className="drop-shadow-md"
                />
              </div>

              {/* Main Headline - On top of chain with subtle shadow for depth */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight drop-shadow-sm">
                  From Farm to Buyer.
                  <span className="block mt-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                    On-Chain.
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-xl drop-shadow-sm bg-white/40 backdrop-blur-sm p-4 rounded-lg">
                  A decentralized marketplace where farmers list produce directly,
                  buyers purchase transparently, and every batch can be publicly verified.
                </p>
              </div>

              {/* CTA Buttons - Terminal points of the chain's visual flow */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/farmer"
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-2xl shadow-orange-300/50 hover:shadow-2xl hover:shadow-orange-400/60 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 z-20"
                >
                  I'm a Farmer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/marketplace"
                  className="group relative px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold rounded-xl border-2 border-gray-300 hover:border-orange-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 z-20"
                >
                  I'm a Buyer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Indicators - Enhanced with backdrop */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-300/50 bg-white/30 backdrop-blur-sm p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Verified</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">On-Chain</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Direct</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">No Middlemen</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Fair</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">Pricing</p>
                </div>
              </div>
            </div>

            {/* Right Content - Premium Mockup with enhanced depth */}
            <div className="relative lg:block animate-fade-in-delay">
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 to-amber-300/30 rounded-[4rem] blur-3xl scale-110 animate-gentle-pulse" />

              {/* Mockup Container */}
              <div className="relative z-10 transform hover:scale-[1.02] transition-all duration-700 ease-out drop-shadow-2xl">
                <Image
                  src="/images/hero-mockup.png"
                  alt="CitraChain App - Decentralized Orange Markets"
                  width={870}
                  height={1015}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
