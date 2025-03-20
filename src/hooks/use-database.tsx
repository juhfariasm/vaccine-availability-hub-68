
import { useState, useEffect } from 'react';
import { initializeDatabase, getAllVaccines, getAllUBS, updateVaccineAvailability } from '../services/databaseService';
import { UBSModel, VaccineModel } from '../types/ubs';
import { useToast } from './use-toast';

export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vaccines, setVaccines] = useState<VaccineModel[]>([]);
  const [ubsList, setUbsList] = useState<UBSModel[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const connectToDatabase = async () => {
      try {
        setIsLoading(true);
        // Inicializar a conexão com o banco de dados
        const connected = await initializeDatabase();
        setIsConnected(connected);
        
        if (connected) {
          // Buscar dados iniciais
          const [vaccineData, ubsData] = await Promise.all([
            getAllVaccines(),
            getAllUBS()
          ]);
          
          setVaccines(vaccineData);
          setUbsList(ubsData);
          
          toast({
            title: "Conectado ao banco de dados",
            description: "Os dados foram carregados com sucesso.",
          });
        } else {
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Database connection error:', error);
        toast({
          title: "Erro de conexão",
          description: "Ocorreu um erro ao conectar com o banco de dados.",
          variant: "destructive"
        });
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    connectToDatabase();
  }, [toast]);

  // Função para atualizar a disponibilidade de uma vacina
  const updateVaccineStatus = async (ubsId: number, vaccineId: number, available: boolean): Promise<boolean> => {
    try {
      const success = await updateVaccineAvailability(ubsId, vaccineId, available);
      
      if (success) {
        // Atualizar o estado local para refletir a mudança
        setUbsList(prev => {
          const updated = [...prev];
          const ubsIndex = updated.findIndex(ubs => ubs.id === ubsId);
          
          if (ubsIndex !== -1) {
            const vaccineIndex = updated[ubsIndex].vaccines?.findIndex(v => v.id === vaccineId);
            
            if (vaccineIndex !== -1 && updated[ubsIndex].vaccines) {
              updated[ubsIndex].vaccines[vaccineIndex].UBSVaccine = {
                ...updated[ubsIndex].vaccines[vaccineIndex].UBSVaccine!,
                available
              };
            }
          }
          
          return updated;
        });
        
        toast({
          title: "Atualização concluída",
          description: `Disponibilidade da vacina ${available ? 'ativada' : 'desativada'}.`,
        });
      }
      
      return success;
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

  // Recarregar dados
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [vaccineData, ubsData] = await Promise.all([
        getAllVaccines(),
        getAllUBS()
      ]);
      
      setVaccines(vaccineData);
      setUbsList(ubsData);
      
      toast({
        title: "Dados atualizados",
        description: "Os dados foram recarregados com sucesso.",
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
