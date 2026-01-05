'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Wallet, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWallet } from '@/context/WalletContext';

const NavLink = ({
  href,
  children,
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        isActive
          ? 'text-primary font-bold'
          : 'text-stone-600'
      )}
    >
      {children}
    </Link>
  );
};

export function Header() {
  const pathname = usePathname();
  const isMarketplace = pathname === '/marketplace';
  const { account, connectWallet, isConnected } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border border-gray-100 shadow-sm">
            <Image
              src="/logo.png"
              alt="Citra Chain Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <Image
              src="/title.png"
              alt="Citra Chain"
              width={160}
              height={40}
              className="object-contain w-[120px] md:w-[200px]"
              style={{ filter: 'brightness(0.6) saturate(1.2)' }}
              priority
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:flex items-center gap-8">
          <NavLink href="/">Farmer</NavLink>
          <NavLink href="/marketplace">Marketplace</NavLink>
          <NavLink href="/wallet">Wallet</NavLink>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {isMarketplace && (
            <div className="relative hidden w-64 lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crop, location..."
                className="w-full rounded-full border border-input bg-muted/50 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <Button
            variant="default"
            onClick={connectWallet}
            size="sm"
            className="hidden md:flex rounded-full bg-gradient-to-r from-primary to-orange-600 px-6 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? `${account?.substring(0, 6)}...` : 'Connect'}
          </Button>

          {/* Mobile connect button icon only if needed, or just keep desktop one hidden */}
          {isConnected && (
            <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-white shadow-sm cursor-pointer">
              <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden p-4">
          <nav className="flex flex-col gap-4">
            <NavLink href="/" onClick={() => setIsMenuOpen(false)}>Farmer Dashboard</NavLink>
            <NavLink href="/marketplace" onClick={() => setIsMenuOpen(false)}>Marketplace</NavLink>
            <NavLink href="/wallet" onClick={() => setIsMenuOpen(false)}>Wallet</NavLink>
            <div className="pt-2">
              <Button
                variant="default"
                onClick={() => { connectWallet(); setIsMenuOpen(false); }}
                className="w-full justify-start rounded-full bg-gradient-to-r from-primary to-orange-600 text-white"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}