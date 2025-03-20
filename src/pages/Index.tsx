
import { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast"
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NearbyUBS from '@/components/NearbyUBS';
import SearchSection from '@/components/SearchSection';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';
import { initDatabase } from '@/db/init';

const Index = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Inicializa o banco de dados
    const initDb = async () => {
      try {
        const initialized = await initDatabase();
        setDbInitialized(initialized);
        
        if (!initialized) {
          toast({
            title: "Aviso",
            description: "Não foi possível conectar ao banco de dados. Usando dados locais.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao conectar ao banco de dados. Usando dados locais.",
          variant: "destructive",
        });
      }
    };
    
    initDb();
    
    // Get user location when the page loads
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location:', position.coords.latitude, position.coords.longitude);
          // In a real app, we would use this to find nearby UBSs
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <NearbyUBS />
      <SearchSection />
      <InfoSection />
      <Footer />
    </div>
  );
};

export default Index;
