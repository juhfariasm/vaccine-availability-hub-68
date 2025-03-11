
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Info } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);

      // Determine active section
      const sections = ['home', 'search', 'info'];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      sectionElements.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop - 100;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[index]);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-out",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-medium">
            <span className="text-teal-600">Info</span>Vac
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant="ghost"
            className={cn(
              "transition-all duration-300",
              activeSection === 'home' && "text-teal-600"
            )}
            onClick={() => scrollToSection('home')}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Início
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "transition-all duration-300",
              activeSection === 'search' && "text-teal-600"
            )}
            onClick={() => scrollToSection('search')}
          >
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "transition-all duration-300",
              activeSection === 'info' && "text-teal-600"
            )}
            onClick={() => scrollToSection('info')}
          >
            <Info className="mr-2 h-4 w-4" />
            Informações
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Button variant="outline" size="icon" className="rounded-full">
              <span className="sr-only">Menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
