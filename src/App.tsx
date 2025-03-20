
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Colaborador from '@/pages/Colaborador';
import GerenciarVacinas from '@/pages/GerenciarVacinas';
import NotFound from '@/pages/NotFound';
import DatabaseInitializer from '@/components/DatabaseInitializer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <DatabaseInitializer />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/colaborador" element={<Colaborador />} />
        <Route path="/gerenciar-vacinas" element={<GerenciarVacinas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
