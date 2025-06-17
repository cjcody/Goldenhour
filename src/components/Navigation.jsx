import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWebsiteConfig } from '../contexts/WebsiteConfigContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFixedVisible, setIsFixedVisible] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { config, loading } = useWebsiteConfig();

  // Create dynamic nav items from config
  const navItems = config?.navigation ? [
    { name: config.navigation.home, href: '/' },
    { name: config.navigation.about, href: '/about' },
    { name: config.navigation.menu, href: '/menu' },
    { name: config.navigation.contact, href: '/contact' }
  ] : [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Contact', href: '/contact' }
  ];

  // Handle scroll events for dual navbar system
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const staticNav = document.getElementById('static-navbar');
      
      if (staticNav) {
        const rect = staticNav.getBoundingClientRect();
        const scrolledPastStatic = rect.bottom <= 0;
        
        setIsScrolled(scrolledPastStatic);
        
        if (scrolledPastStatic) {
          setIsFixedVisible(true);
        } else {
          setIsFixedVisible(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Skeleton loading component
  const NavigationSkeleton = ({ isFixed = false }) => (
    <div className="container mx-auto px-4">
      <div className={`flex items-center justify-between ${isFixed ? 'h-16' : 'h-20'}`}>
        {/* Logo Skeleton */}
        <div className="flex items-center space-x-2">
          <div className={`${isFixed ? 'w-6 h-6' : 'w-8 h-8'} bg-gray-200 rounded animate-pulse`}></div>
          <div className={`${isFixed ? 'w-32 h-6' : 'w-40 h-8'} bg-gray-200 rounded animate-pulse`}></div>
        </div>

        {/* Desktop Navigation Skeleton */}
        <div className="hidden lg:flex items-center space-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Mobile Menu Button Skeleton */}
        <div className="lg:hidden w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );

  const NavbarContent = ({ isFixed = false }) => {
    // Show skeleton while loading
    if (loading) {
      return <NavigationSkeleton isFixed={isFixed} />;
    }

    return (
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between ${isFixed ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo Image or Nothing */}
            {config?.navigation?.logoImage && (
              <img 
                src={config.navigation.logoImage} 
                alt={config.navigation.companyName || 'Logo'}
                className={`${isFixed ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
              />
            )}
            <span className={`font-bold text-amber-600 ${isFixed ? 'text-xl' : 'text-2xl'}`}>
              {config?.navigation?.companyName || 'Artisanal Baking'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors ${
                  location.pathname === item.href 
                    ? 'text-amber-600' 
                    : 'text-gray-700 hover:text-amber-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/custom-order"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              {config?.navigation?.customOrder || 'Custom Order'}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500" 
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors ${
                    location.pathname === item.href 
                      ? 'text-amber-600' 
                      : 'text-gray-700 hover:text-amber-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/custom-order"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {config?.navigation?.customOrder || 'Custom Order'}
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Static Navigation */}
      <nav 
        id="static-navbar"
        className="bg-white shadow-sm w-full z-40"
      >
        <NavbarContent />
      </nav>

      {/* Fixed Navigation */}
      <nav 
        id="fixed-navbar"
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm transition-transform duration-300 ${
          isFixedVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <NavbarContent isFixed={true} />
      </nav>
    </>
  );
};

export default Navigation; 