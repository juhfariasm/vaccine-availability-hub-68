
import { UBSItem } from '@/types/ubs';
import { vaccinesList } from '@/data/mockUBSData';

// Conditional import for database client
let client;
if (typeof window === 'undefined') {
  import('../database').then(module => {
    client = module.default;
  }).catch(err => {
    console.error('Error importing client:', err);
  });
}

// Convert database row to UBSItem format
const mapDbRowToUBS = (row: any): UBSItem => {
  // Create an object with all vaccines set to false by default
  const vaccines: Record<string, boolean> = {};
  vaccinesList.forEach(vaccine => {
    vaccines[vaccine] = false;
  });

  // If the row has a vaccines column, update the vaccines object
  if (row.vaccines) {
    try {
      const vaccinesFromDb = typeof row.vaccines === 'string' 
        ? JSON.parse(row.vaccines) 
        : row.vaccines;
      
      // If vaccines is an array, consider them as names of available vaccines
      if (Array.isArray(vaccinesFromDb)) {
        vaccinesFromDb.forEach(vaccine => {
          if (vaccinesList.includes(vaccine)) {
            vaccines[vaccine] = true;
          }
        });
      } 
      // If it's an object, we assume it's in {name: boolean} format
      else if (typeof vaccinesFromDb === 'object') {
        Object.keys(vaccinesFromDb).forEach(key => {
          if (vaccinesList.includes(key)) {
            vaccines[key] = Boolean(vaccinesFromDb[key]);
          }
        });
      }
    } catch (e) {
      console.error('Error processing vaccines:', e);
    }
  }

  // Ensure status is either 'open' or 'closed' as a union type
  const status: 'open' | 'closed' = row.status === 'open' || 
                                    row.status === 'Aberto' || 
                                    row.status === true ? 
                                    'open' : 'closed';

  return {
    id: row.id,
    name: row.name || row.nome || '',
    address: row.address || row.endereco || '',
    distance: typeof row.distance === 'number' ? row.distance : 0,
    status,
    openingHours: row.opening_hours || row.horario_funcionamento || '08:00 - 18:00',
    vaccines
  };
};

export const getAllUBS = async (): Promise<UBSItem[]> => {
  try {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      console.log('Running in browser, using mock data');
      const { mockUBSData } = await import('@/data/mockUBSData');
      // Ensure mockUBSData is properly typed by mapping it through mapDbRowToUBS
      return mockUBSData.map(mapDbRowToUBS);
    }
    
    // Try to import client dynamically for server environment
    if (!client) {
      try {
        const module = await import('../database');
        client = module.default;
      } catch (e) {
        console.error('Failed to load database client:', e);
        // Fallback to mock data if client can't be loaded
        const { mockUBSData } = await import('@/data/mockUBSData');
        return mockUBSData.map(mapDbRowToUBS);
      }
    }
    
    // Try to get data from the ubs table
    const result = await client.query('SELECT * FROM ubs');
    
    // If we have data, map it to UBSItem format
    if (result && result.rows) {
      console.log(`Found ${result.rows.length} UBS records in database`);
      return result.rows.map(mapDbRowToUBS);
    }
    
    throw new Error('Could not retrieve UBS data');
  } catch (error) {
    console.error('Error fetching UBS data:', error);
    
    // Use mock data as fallback in case of error
    console.warn('Using mock data as fallback.');
    const { mockUBSData } = await import('@/data/mockUBSData');
    return mockUBSData.map(mapDbRowToUBS);
  }
};

export const getUBSByVaccine = async (vaccine: string): Promise<UBSItem[]> => {
  try {
    // Recupera todas as UBS e filtra por vaccine
    const allUBS = await getAllUBS();
    
    if (vaccine === 'all') {
      return allUBS;
    }
    
    return allUBS.filter(ubs => ubs.vaccines[vaccine]);
  } catch (error) {
    console.error('Erro ao buscar UBS por vacina:', error);
    return [];
  }
};

export const getUBSByCity = async (city: string): Promise<UBSItem[]> => {
  try {
    // Recupera todas as UBS e filtra pela cidade
    const allUBS = await getAllUBS();
    
    if (city === 'all') {
      return allUBS;
    }
    
    return allUBS.filter(ubs => ubs.address.includes(city));
  } catch (error) {
    console.error('Erro ao buscar UBS por cidade:', error);
    return [];
  }
};

export const searchUBS = async (
  query: string,
  vaccine: string = 'all',
  city: string = 'all'
): Promise<UBSItem[]> => {
  try {
    // Recupera todas as UBS
    const allUBS = await getAllUBS();
    
    return allUBS.filter(ubs => {
      const matchesQuery = !query || 
        ubs.name.toLowerCase().includes(query.toLowerCase()) || 
        ubs.address.toLowerCase().includes(query.toLowerCase());
        
      const matchesVaccine = vaccine === 'all' || ubs.vaccines[vaccine];
      
      const matchesCity = city === 'all' || ubs.address.includes(city);
      
      return matchesQuery && matchesVaccine && matchesCity;
    });
  } catch (error) {
    console.error('Erro ao pesquisar UBS:', error);
    return [];
  }
};

// Para obter as UBS mais próximas, precisaríamos de coordenadas
// Para simplificar, vamos ordenar por distância como mockup
export const getNearbyUBS = async (limit: number = 3): Promise<UBSItem[]> => {
  try {
    const allUBS = await getAllUBS();
    return allUBS
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  } catch (error) {
    console.error('Erro ao buscar UBS próximas:', error);
    return [];
  }
};
