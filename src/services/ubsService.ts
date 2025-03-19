import { UBSItem } from '@/types/ubs';
import { vaccinesList } from '@/data/mockUBSData';

// Conditional import for database pool
let pool;
if (typeof window === 'undefined') {
  import('../db.js').then(module => {
    pool = module.default;
  }).catch(err => {
    console.error('Error importing pool:', err);
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

  return {
    id: row.id,
    name: row.name || row.nome || '',
    address: row.address || row.endereco || '',
    distance: typeof row.distance === 'number' ? row.distance : 0,
    status: row.status === 'Aberto' || row.status === 'open' ? 'open' : 'closed',
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
      return mockUBSData;
    }
    
    // Try to import pool dynamically for server environment
    if (!pool) {
      try {
        const module = await import('../db.js');
        pool = module.default;
      } catch (e) {
        console.error('Failed to load database pool:', e);
        // Fallback to mock data if pool can't be loaded
        const { mockUBSData } = await import('@/data/mockUBSData');
        return mockUBSData;
      }
    }
    
    // Try to get data from the ubs table
    const result = await pool.query('SELECT * FROM ubs');
    
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
    return mockUBSData;
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
