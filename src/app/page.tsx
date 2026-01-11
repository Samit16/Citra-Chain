import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FinalCTA } from '@/components/landing/final-cta';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CitraChain - From Farm to Buyer. On-Chain.',
    description: 'A decentralized agricultural marketplace where farmers list produce directly, buyers purchase transparently, and every batch can be publicly verified. Built on blockchain for real-world impact.',
    keywords: ['blockchain', 'agriculture', 'marketplace', 'farmers', 'transparency', 'Web3', 'supply chain'],
    openGraph: {
        title: 'CitraChain - From Farm to Buyer. On-Chain.',
        description: 'Bringing transparency to agricultural supply chains with blockchain technology.',
        type: 'website',
    },
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <LandingNav />

            <div className="pt-20">
                <HeroSection />

                <div id="how-it-works">
                    <HowItWorks />
                </div>

                <FinalCTA />
            </div>

            <LandingFooter />
        </main>
    );
}
