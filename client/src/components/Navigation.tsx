import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDocsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/contribute", label: "Contribute" },
    { href: "/agora", label: "Agora" },
  ];

  const docsLinks = [
    { href: "/manifesto", label: "Manifesto" },
    { href: "/structure", label: "Structure" },
  ];

  return (
    <nav className="bg-white border-b border-venus-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold tracking-tight cursor-pointer hover:text-gray-700 transition-colors">
                THE VENUS PROJECT
              </span>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium hover:text-venus-lime transition-colors cursor-pointer ${
                      isActive(link.href) ? "text-venus-lime" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Dropdown - Desktop */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setDocsDropdownOpen(!docsDropdownOpen)}
              className="px-3 py-2 text-sm font-medium hover:text-venus-lime transition-colors focus:outline-none"
            >
              Docs ↓
            </button>
            {docsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-venus-gray rounded-md shadow-lg z-50">
                {docsLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:text-venus-lime transition-colors cursor-pointer ${
                        isActive(link.href) ? "text-venus-lime" : ""
                      }`}
                      onClick={() => setDocsDropdownOpen(false)}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black hover:text-venus-lime focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-venus-gray">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-sm font-medium hover:text-venus-lime transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-venus-lime" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            {docsLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-sm font-medium hover:text-venus-lime transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-venus-lime" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
