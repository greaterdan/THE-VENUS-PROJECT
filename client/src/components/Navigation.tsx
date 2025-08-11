import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { SiX, SiGithub } from "react-icons/si";
import agoraIcon from "@assets/Untitled design_1754878809797.gif";
import docsIcon from "@assets/Untitled design_1754879488364.gif";
import contributeIcon from "@assets/Untitled design (1)_1754880001361.gif";
import venusIcon from "@assets/Untitled design (2)_1754882967112.gif";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [agoraDropdownOpen, setAgoraDropdownOpen] = useState(false);
  const [contributeDropdownOpen, setContributeDropdownOpen] = useState(false);
  const [venusDropdownOpen, setVenusDropdownOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const agoraDropdownRef = useRef<HTMLDivElement>(null);
  const contributeDropdownRef = useRef<HTMLDivElement>(null);
  const venusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDocsDropdownOpen(false);
      }
      if (agoraDropdownRef.current && !agoraDropdownRef.current.contains(event.target as Node)) {
        setAgoraDropdownOpen(false);
      }
      if (contributeDropdownRef.current && !contributeDropdownRef.current.contains(event.target as Node)) {
        setContributeDropdownOpen(false);
      }
      if (venusDropdownRef.current && !venusDropdownRef.current.contains(event.target as Node)) {
        setVenusDropdownOpen(false);
      }
    }

    function handleScroll() {
      setScrollY(window.scrollY);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Calculate navigation opacity based on scroll and location
  // On landing page: invisible at start, appears when scrolling with smooth fade
  // On other pages: always visible
  const navOpacity = location === "/" ? Math.min(1, scrollY / 100) : 1;

  const venusLinks = [
    { href: "/", label: "THE VENUS PROJECT" },
    { href: "/nfts", label: "NFTs" },
  ];

  const contributeLinks = [
    { href: "/contribute", label: "Contribute" },
  ];

  const agoraLinks = [
    { href: "/agora", label: "Agora" },
  ];

  const docsLinks = [
    { href: "/manifesto", label: "Manifesto" },
    { href: "/structure", label: "Structure" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Right Navigation Group - Desktop */}
          <div className="hidden md:block ml-auto transition-opacity duration-500 ease-in-out" style={{ opacity: navOpacity }}>
            <div className="flex items-baseline space-x-2">
              <div 
                className="relative group" 
                ref={venusDropdownRef}
                onMouseEnter={() => setVenusDropdownOpen(true)}
                onMouseLeave={() => setVenusDropdownOpen(false)}
              >
                <button className="px-2 py-2 text-black focus:outline-none">
                  <img src={venusIcon} alt="Venus Project" className="h-8 w-8" />
                </button>
                {venusDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full w-48 bg-white border border-venus-gray rounded-md shadow-lg z-50"
                    onMouseEnter={() => setVenusDropdownOpen(true)}
                    onMouseLeave={() => setVenusDropdownOpen(false)}
                  >
                    {venusLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          className={`block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-venus-lime transition-all duration-300 ease-out transform hover:translate-x-1 cursor-pointer ${
                            isActive(link.href) ? "text-venus-lime" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div 
                className="relative group" 
                ref={agoraDropdownRef}
                onMouseEnter={() => setAgoraDropdownOpen(true)}
                onMouseLeave={() => setAgoraDropdownOpen(false)}
              >
                <button className="px-2 py-2 text-black focus:outline-none">
                  <img src={agoraIcon} alt="Agora" className="h-8 w-8" />
                </button>
                {agoraDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full w-32 bg-white border border-venus-gray rounded-md shadow-lg z-50"
                    onMouseEnter={() => setAgoraDropdownOpen(true)}
                    onMouseLeave={() => setAgoraDropdownOpen(false)}
                  >
                    {agoraLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          className={`block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-venus-lime transition-all duration-300 ease-out transform hover:translate-x-1 cursor-pointer ${
                            isActive(link.href) ? "text-venus-lime" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div 
                className="relative group" 
                ref={contributeDropdownRef}
                onMouseEnter={() => setContributeDropdownOpen(true)}
                onMouseLeave={() => setContributeDropdownOpen(false)}
              >
                <button className="px-2 py-2 text-black focus:outline-none">
                  <img src={contributeIcon} alt="Contribute" className="h-8 w-8" />
                </button>
                {contributeDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full w-32 bg-white border border-venus-gray rounded-md shadow-lg z-50"
                    onMouseEnter={() => setContributeDropdownOpen(true)}
                    onMouseLeave={() => setContributeDropdownOpen(false)}
                  >
                    {contributeLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          className={`block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-venus-lime transition-all duration-300 ease-out transform hover:translate-x-1 cursor-pointer ${
                            isActive(link.href) ? "text-venus-lime" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div 
                className="relative group" 
                ref={dropdownRef}
                onMouseEnter={() => setDocsDropdownOpen(true)}
                onMouseLeave={() => setDocsDropdownOpen(false)}
              >
                <button className="px-2 py-2 text-black focus:outline-none">
                  <img src={docsIcon} alt="Docs" className="h-8 w-8" />
                </button>
                {docsDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full w-48 bg-white border border-venus-gray rounded-md shadow-lg z-50"
                    onMouseEnter={() => setDocsDropdownOpen(true)}
                    onMouseLeave={() => setDocsDropdownOpen(false)}
                  >
                    {docsLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <span
                          className={`block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-venus-lime transition-all duration-300 ease-out transform hover:translate-x-1 cursor-pointer ${
                            isActive(link.href) ? "text-venus-lime" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden transition-opacity duration-500 ease-in-out" style={{ opacity: navOpacity }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black hover:text-venus-lime focus:outline-none transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {venusLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-sm font-medium text-black hover:text-venus-lime transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-venus-lime" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            {contributeLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-sm font-medium text-black hover:text-venus-lime transition-colors cursor-pointer ${
                    isActive(link.href) ? "text-venus-lime" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            {agoraLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-3 py-2 text-sm font-medium text-black hover:text-venus-lime transition-colors cursor-pointer ${
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
                  className={`block px-3 py-2 text-sm font-medium text-black hover:text-venus-lime transition-colors cursor-pointer ${
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