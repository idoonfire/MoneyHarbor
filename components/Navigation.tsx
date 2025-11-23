// Professional minimal navigation bar

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  onLogoClick?: () => void;
}

export default function Navigation({ onLogoClick }: NavigationProps = {}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'דף הבית' },
    { href: '/my-harbor', label: 'הנמל שלי' },
    { href: '/faq', label: 'שאלות' },
    { href: '/disclaimer', label: 'תנאים' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're on homepage and have onLogoClick callback, use it
    if (pathname === '/' && onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
    // Otherwise let the Link handle navigation normally
  };

  return (
    <nav className="glass-light border-b py-3 px-4 sticky top-0 z-50 shadow-xl" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo/Brand - Minimal */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={handleLogoClick}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              borderColor: 'rgba(255, 149, 0, 0.8)',
              borderWidth: '2px'
            }}>
              {/* Minimal Anchor Icon */}
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="20" r="6" fill="#0a0a0a"/>
                <circle cx="50" cy="20" r="3.5" fill="white"/>
                <rect x="48.5" y="26" width="3" height="42" fill="#0a0a0a" rx="1"/>
                <path d="M50 67 Q40 64, 32 71 L32 74 Q40 68, 50 70 Z" fill="#0a0a0a"/>
                <path d="M50 67 Q60 64, 68 71 L68 74 Q60 68, 50 70 Z" fill="#0a0a0a"/>
                <rect x="32" y="41" width="36" height="3" fill="#0a0a0a" rx="1.5"/>
                <circle cx="32" cy="42.5" r="2" fill="#ff9500"/>
                <circle cx="68" cy="42.5" r="2" fill="#ff9500"/>
              </svg>
            </div>
            <span className="hidden md:block text-lg font-bold tracking-tight" style={{ color: '#ff9500', fontFamily: 'var(--font-ibm)' }}>
              MoneyHarbor
            </span>
          </Link>

          {/* Navigation Items - Minimal Tabs */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all relative ${
                    isActive ? '' : 'hover:opacity-70'
                  }`}
                  style={{
                    color: isActive ? '#ff9500' : '#8a8a8a',
                    fontFamily: 'var(--font-assistant)',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ 
                      background: 'linear-gradient(90deg, transparent, #ff9500, transparent)' 
                    }}></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
