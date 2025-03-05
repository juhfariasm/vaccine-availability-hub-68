
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NearbyUBS from '@/components/NearbyUBS';
import SearchSection from '@/components/SearchSection';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
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
