import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#FFFBF5] text-sm text-gray-500">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8">
        <div className="flex items-center gap-2">
          <span>© 2023 Nagpur Orange DAO.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Transparency built on Blockchain
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-primary">
            Smart Contract
          </Link>
          <Link href="#" className="hover:text-primary">
            Support
          </Link>
          <Link href="#" className="hover:text-primary">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
