import { Footer } from '@/components/marketplace/footer';
import { Header } from '@/components/shared/header';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <Header />
      {children}
    </div>
  );
}
