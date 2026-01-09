'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50/30 -z-10" />
      
      {/* Decorative orange glow - top right */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-radial from-orange-200/40 via-orange-100/20 to-transparent rounded-full blur-3xl -z-5" />
      
      {/* Decorative glow - bottom left */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-amber-200/30 via-yellow-100/10 to-transparent rounded-full blur-3xl -z-5" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">CitraChain</h2>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                From Farm to Buyer.
                <span className="block mt-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  On-Chain.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-xl">
                A decentralized marketplace where farmers list produce directly, 
                buyers purchase transparently, and every batch can be publicly verified.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/farmer"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                I'm a Farmer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/marketplace"
                className="group relative px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                I'm a Buyer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
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

          {/* Right Content - Product Mockup */}
          <div className="relative lg:block animate-fade-in-delay">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/50 to-amber-300/50 rounded-[3rem] blur-3xl scale-110" />
            
            {/* Phone Mockup */}
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <Image
                src="/images/mockup-phone.png"
                alt="CitraChain Marketplace App"
                width={600}
                height={800}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -left-8 bottom-32 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-orange-100 animate-float hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Batch Verified</p>
                  <p className="text-lg font-black text-gray-900">Nagpur, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Floating Price Card */}
            <div className="absolute -right-4 top-24 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-orange-100 animate-float-delay hidden md:block">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Fair Price</p>
                <p className="text-3xl font-black text-orange-600">₹40/kg</p>
                <p className="text-xs text-gray-500">Directly from farmer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
