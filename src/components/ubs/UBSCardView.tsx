
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import UBSCard from './UBSCard';
import { UBSItem } from '@/types/ubs';
import { useIsMobile } from '@/hooks/use-mobile';

interface UBSCardViewProps {
  searchResults: UBSItem[];
}

const UBSCardView = ({ searchResults }: UBSCardViewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const CARDS_PER_PAGE = isMobile ? 1 : 3;
  const totalPages = Math.ceil(searchResults.length / CARDS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchResults]);

  const nextSlide = () => {
    if (totalPages > 0) {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }
  };

  const prevSlide = () => {
    if (totalPages > 0) {
      setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    }
  };

  if (searchResults.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
        <p className="text-gray-600">
          Tente ajustar seus filtros ou buscar por outro termo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={prevSlide}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full p-0 bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-teal-50"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </Button>
      
      <Button
        onClick={nextSlide}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full p-0 bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-teal-50"
        aria-label="Próximo"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </Button>
      
      <div 
        ref={carouselRef}
        className="overflow-hidden"
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out" 
          style={{ 
            transform: totalPages > 0 ? `translateX(-${currentPage * 100}%)` : 'translateX(0)',
          }}
        >
          {totalPages > 0 && Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div 
              key={`page-${pageIndex}`} 
              className="flex gap-3 md:gap-6 min-w-full justify-center"
            >
              {searchResults
                .slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE)
                .map((ubs) => (
                  <UBSCard key={`ubs-${ubs.id}-${pageIndex}`} ubs={ubs} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UBSCardView;
