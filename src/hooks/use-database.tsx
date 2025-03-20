
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { UBSModel, VaccineModel } from '../types/ubs';
import { vaccinesList } from '../data/mockUBSData';

// Mock data to use as fallback
const mockVaccines: VaccineModel[] = vaccinesList.map((name, index) => ({
  id: index + 1,
  name
}));

// Empty list to start with - will be populated with API calls
const initialUbsList: UBSModel[] = [];

export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vaccines, setVaccines] = useState<VaccineModel[]>(mockVaccines);
  const [ubsList, setUbsList] = useState<UBSModel[]>(initialUbsList);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Instead of directly using Sequelize in the browser,
        // we'll simulate an API call to fetch data
        // In a real app, you'd make fetch calls to your backend API
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, we're not connected to a real database
        setIsConnected(false);
        
        // Use mock data since we're not connected
        setVaccines(mockVaccines);
        setUbsList(initialUbsList);
        
        toast({
          title: "Modo demonstração",
          description: "Usando dados demonstrativos no frontend.",
          variant: "default"
        });
      } catch (error) {
        console.error('Database simulation error:', error);
        toast({
          title: "Erro de conexão",
          description: "Usando dados demonstrativos como fallback.",
          variant: "destructive"
        });
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Função para atualizar a disponibilidade de uma vacina (simulada)
  const updateVaccineStatus = async (ubsId: number, vaccineId: number, available: boolean): Promise<boolean> => {
    try {
      // Atualizar o estado local para refletir a mudança
      setUbsList(prev => {
        const updated = [...prev];
        const ubsIndex = updated.findIndex(ubs => ubs.id === ubsId);
        
        if (ubsIndex !== -1 && updated[ubsIndex].vaccines) {
          const vaccineIndex = updated[ubsIndex].vaccines.findIndex(v => v.id === vaccineId);
          
          if (vaccineIndex !== -1) {
            // Aqui estamos garantindo que vaccines existe e atualizando o UBSVaccine
            const updatedVaccines = [...updated[ubsIndex].vaccines];
            updatedVaccines[vaccineIndex] = {
              ...updatedVaccines[vaccineIndex],
              UBSVaccine: {
                id: 0,
                ubsId,
                vaccineId,
                available
              }
            };
            
            updated[ubsIndex] = {
              ...updated[ubsIndex],
              vaccines: updatedVaccines
            };
          }
        }
        
        return updated;
      });
      
      toast({
        title: "Atualização simulada",
        description: `Disponibilidade da vacina ${available ? 'ativada' : 'desativada'} (demonstração).`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating vaccine status:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar a disponibilidade da vacina.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Recarregar dados (simulação)
  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Simulação de recarregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Dados atualizados",
        description: "Os dados foram recarregados com sucesso (demonstração).",
      });
      
      return true;
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível recarregar os dados.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    vaccines,
    ubsList,
    updateVaccineStatus,
    refreshData
  };
};
