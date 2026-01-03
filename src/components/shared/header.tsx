'use client';
import { Button } from '@/components/ui/button';
import { Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const OrangeIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#FFFAF2" />
    <path
      d="M25.7981 18.257C25.7981 17.7579 26.2231 17.3428 26.7356 17.3428C27.2481 17.3428 27.6731 17.7579 27.6731 18.257C27.6731 23.0133 23.7781 26.8105 18.9031 26.8105C14.0281 26.8105 10.1332 23.0133 10.1332 18.257C10.1332 17.7579 10.5582 17.3428 11.0707 17.3428C11.5832 17.3428 12.0082 17.7579 12.0082 18.257C12.0082 21.9056 15.0907 24.915 18.9031 24.915C22.7156 24.915 25.7981 21.9056 25.7981 18.257Z"
      fill="#F58A07"
    />
    <path
      d="M20.7787 11.0969C21.0349 11.0969 21.2424 11.3044 21.2424 11.5606V19.3444C21.2424 19.5419 21.0937 19.7281 20.8962 19.7919L15.3624 21.6044C15.1187 21.6831 14.8624 21.5694 14.7837 21.3256C14.705 21.0819 14.8187 20.8256 15.0624 20.7469L20.3137 18.9956V11.5606C20.3137 11.3044 20.5212 11.0969 20.7787 11.0969Z"
      fill="#F58A07"
    />
  </svg>
);

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-stone-200/50 text-stone-900'
          : 'text-stone-600 hover:bg-stone-200/50'
      )}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const pathname = usePathname();
  const isMarketplace = pathname === '/marketplace';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <OrangeIcon />
          <div className="ml-2">
            <h1 className="text-md font-bold text-[#1E1E1E]">NagpurMarket</h1>
            <p className="text-xs text-gray-500 -mt-1">DECENTRALIZED TRADE</p>
          </div>
        </div>
        <nav className="flex items-center gap-2 rounded-full bg-stone-100/80 p-1">
          <NavLink href="/">Farmer</NavLink>
          <NavLink href="/marketplace">Marketplace</NavLink>
          <NavLink href="/my-bids">My Bids</NavLink>
          <NavLink href="/wallet">Wallet</NavLink>
          <NavLink href="/analytics">Analytics</NavLink>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          {isMarketplace && (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crop, location..."
                className="w-full rounded-full border border-stone-200 bg-stone-100/80 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          <Button
            variant="default"
            className="rounded-full bg-primary text-white hover:bg-primary/90"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
