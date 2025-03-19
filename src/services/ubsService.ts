import { UBSItem } from '@/types/ubs';
import { vaccinesList } from '@/data/mockUBSData';

// Importação condicional do pool
let pool: any;
try {
  // Tenta importar o pool apenas no ambiente Node.js
  if (typeof window === 'undefined') {
    // Usando dynamic import para ES modules
    const poolModule = await import('../db.js');
    pool = poolModule.default;
  }
} catch (error) {
  console.warn('Erro ao importar o pool de conexão:', error);
}

// Converter os dados do banco para o formato UBSItem
const mapDbRowToUBS = (row: any): UBSItem => {
  // Cria um objeto com todas as vacinas definidas como false por padrão
  const vaccines: Record<string, boolean> = {};
  vaccinesList.forEach(vaccine => {
    vaccines[vaccine] = false;
  });

  // Se o row tiver uma coluna vaccines, atualiza o objeto vaccines
  if (row.vaccines) {
    try {
      const vaccinesFromDb = Array.isArray(row.vaccines) 
        ? row.vaccines 
        : JSON.parse(row.vaccines);
      
      // Se vaccines for um array, consideramos que são os nomes das vacinas disponíveis
      if (Array.isArray(vaccinesFromDb)) {
        vaccinesFromDb.forEach(vaccine => {
          if (vaccinesList.includes(vaccine)) {
            vaccines[vaccine] = true;
          }
        });
      } 
      // Se for um objeto, assumimos que está no formato {nome: boolean}
      else if (typeof vaccinesFromDb === 'object') {
        Object.keys(vaccinesFromDb).forEach(key => {
          if (vaccinesList.includes(key)) {
            vaccines[key] = Boolean(vaccinesFromDb[key]);
          }
        });
      }
    } catch (e) {
      console.error('Erro ao processar as vacinas:', e);
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
    // Verifica se estamos no navegador
    if (typeof window !== 'undefined' || !pool) {
      console.log('Executando no navegador ou pool não disponível, usando dados mockados');
      const { mockUBSData } = await import('@/data/mockUBSData');
      return mockUBSData as UBSItem[];
    }
    
    // Tentando obter dados da tabela ubs
    const result = await pool.query('SELECT * FROM ubs');
    
    // Se não houver erro e tiver dados, mapeia para o formato UBSItem
    if (result && result.rows) {
      return result.rows.map(mapDbRowToUBS);
    }
    
    throw new Error('Não foi possível recuperar os dados da UBS');
  } catch (error) {
    console.error('Erro ao buscar dados das UBS:', error);
    
    // Em caso de erro (por exemplo, tabela não existe), use os dados mockados
    console.warn('Usando dados mockados como fallback.');
    
    // Importamos os dados mockados diretamente aqui para não criar dependência circular
    const { mockUBSData } = await import('@/data/mockUBSData');
    return mockUBSData as UBSItem[];
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
