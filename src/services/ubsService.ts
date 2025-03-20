import { UBS, Vaccine, UBSVaccine } from '../db/models';
import sequelize from '../db/config';
import { UBSItem } from '@/types/ubs';
import { vaccinesList } from '@/data/mockUBSData';
import { Op } from 'sequelize'; // Import Op directly

// Função para inicializar dados no banco se necessário
export const initializeData = async () => {
  try {
    // Verifica se já existem vacinas cadastradas
    const vaccineCount = await Vaccine.count();
    
    if (vaccineCount === 0) {
      // Cria as vacinas padrão
      await Promise.all(
        vaccinesList.map(name => Vaccine.create({ name }))
      );
      console.log('Vacinas padrão criadas com sucesso.');
    }

    // Verifica se já existem UBSs cadastradas
    const ubsCount = await UBS.count();
    
    if (ubsCount === 0) {
      // Cria UBSs padrão baseadas nos dados mockados
      const mockUBSData = [
        {
          name: 'UBS Vila Nova',
          address: 'Rua das Flores, 123',
          city: 'Teresina',
          distance: 1.2,
          status: 'open',
          openingHours: '07:00 - 19:00',
        },
        {
          name: 'UBS Central',
          address: 'Av. Principal, 500',
          city: 'Teresina',
          distance: 1.8,
          status: 'open',
          openingHours: '08:00 - 18:00',
        },
        {
          name: 'UBS Jardim América',
          address: 'Rua dos Ipês, 78',
          city: 'Teresina',
          distance: 2.5,
          status: 'open',
          openingHours: '07:00 - 17:00',
        },
        {
          name: 'UBS Parque das Árvores',
          address: 'Alameda dos Cedros, 45',
          city: 'Teresina',
          distance: 3.1,
          status: 'open',
          openingHours: '08:00 - 20:00',
        },
        {
          name: 'UBS São João',
          address: 'Rua dos Pinheiros, 89',
          city: 'Teresina',
          distance: 3.5,
          status: 'open',
          openingHours: '07:00 - 17:00',
        },
        {
          name: 'UBS Boa Vista',
          address: 'Av. das Palmeiras, 321',
          city: 'Timon',
          distance: 4.2,
          status: 'closed',
          openingHours: '08:00 - 18:00',
        }
      ];

      // Cria as UBSs
      for (const ubsData of mockUBSData) {
        const ubs = await UBS.create(ubsData);
        
        // Obtém todas as vacinas
        const vaccines = await Vaccine.findAll();
        
        // Associa vacinas aleatoriamente às UBSs
        for (const vaccine of vaccines) {
          await UBSVaccine.create({
            ubsId: ubs.id,
            vaccineId: vaccine.id,
            available: Math.random() > 0.3, // 70% de chance de estar disponível
          });
        }
      }
      
      console.log('UBSs e associações com vacinas criadas com sucesso.');
    }

    return true;
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
    return false;
  }
};

// Helper function to ensure status is 'open' or 'closed'
const normalizeStatus = (status: string): 'open' | 'closed' => {
  return status === 'open' ? 'open' : 'closed';
};

// Função para buscar todas as UBSs com suas vacinas
export const getAllUBS = async (): Promise<UBSItem[]> => {
  try {
    const ubsList = await UBS.findAll({
      include: [
        {
          model: Vaccine,
          as: 'Vaccines',
          through: { attributes: ['available'] },
        },
      ],
    });

    // Transforma os dados para o formato esperado pela aplicação
    return ubsList.map(ubs => {
      const vaccines: Record<string, boolean> = {};
      
      if (ubs.Vaccines) {
        ubs.Vaccines.forEach((vaccine: any) => {
          vaccines[vaccine.name] = vaccine.UBSVaccine.available;
        });
      }

      // Preenche vacinas que não estão associadas como false
      vaccinesList.forEach(vaccineName => {
        if (vaccines[vaccineName] === undefined) {
          vaccines[vaccineName] = false;
        }
      });

      return {
        id: ubs.id,
        name: ubs.name,
        address: ubs.address,
        distance: ubs.distance,
        status: normalizeStatus(ubs.status), // Normalize status
        openingHours: ubs.openingHours,
        vaccines,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar UBSs:', error);
    return [];
  }
};

// Função para filtrar UBSs por nome e/ou vacina
export const filterUBS = async (
  searchQuery = '',
  vaccineFilter = 'all',
  cityFilter = 'all'
): Promise<UBSItem[]> => {
  try {
    const query: any = {};
    const whereClause: any = {};
    
    // Filtro por cidade
    if (cityFilter !== 'all') {
      whereClause.city = cityFilter;
    }
    
    // Filtro por nome ou endereço
    if (searchQuery) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${searchQuery}%` } },
        { address: { [Op.iLike]: `%${searchQuery}%` } },
      ];
    }
    
    query.where = whereClause;
    
    // Inclui as vacinas
    query.include = [
      {
        model: Vaccine,
        as: 'Vaccines',
        through: { attributes: ['available'] },
      },
    ];
    
    // Busca as UBSs com os filtros
    const ubsList = await UBS.findAll(query);
    
    // Transforma os dados para o formato esperado pela aplicação
    let results = ubsList.map(ubs => {
      const vaccines: Record<string, boolean> = {};
      
      if (ubs.Vaccines) {
        ubs.Vaccines.forEach((vaccine: any) => {
          vaccines[vaccine.name] = vaccine.UBSVaccine.available;
        });
      }
      
      // Preenche vacinas que não estão associadas como false
      vaccinesList.forEach(vaccineName => {
        if (vaccines[vaccineName] === undefined) {
          vaccines[vaccineName] = false;
        }
      });
      
      return {
        id: ubs.id,
        name: ubs.name,
        address: ubs.address,
        distance: ubs.distance,
        status: normalizeStatus(ubs.status), // Normalize status
        openingHours: ubs.openingHours,
        vaccines,
      };
    });
    
    // Filtra por vacina se necessário
    if (vaccineFilter !== 'all') {
      results = results.filter(ubs => ubs.vaccines[vaccineFilter]);
    }
    
    return results;
  } catch (error) {
    console.error('Erro ao filtrar UBSs:', error);
    return [];
  }
};

// Função para obter as UBSs mais próximas
export const getNearbyUBS = async (limit = 3): Promise<UBSItem[]> => {
  try {
    // Na vida real, isso usaria a localização do usuário
    // Por enquanto, apenas retorna as primeiras UBSs ordenadas por distância
    const ubsList = await UBS.findAll({
      where: { status: 'open' },
      include: [
        {
          model: Vaccine,
          as: 'Vaccines',
          through: { attributes: ['available'] },
        },
      ],
      order: [['distance', 'ASC']],
      limit,
    });

    // Transforma os dados para o formato esperado pela aplicação
    return ubsList.map(ubs => {
      const ubsVaccines = ubs.Vaccines || [];
      
      // Formata os dados de vacinas para o componente
      const formattedVaccines = ubsVaccines.slice(0, 4).map((vaccine: any) => ({
        name: vaccine.name,
        available: vaccine.UBSVaccine.available,
      }));
      
      return {
        id: ubs.id,
        name: ubs.name,
        address: ubs.address,
        distance: ubs.distance,
        status: normalizeStatus(ubs.status), // Normalize status
        openingHours: ubs.openingHours,
        vaccines: formattedVaccines,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar UBSs próximas:', error);
    return [];
  }
};

// Função para obter as cidades disponíveis
export const getAvailableCities = async (): Promise<string[]> => {
  try {
    const cities = await UBS.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('city')), 'city']],
      raw: true,
    });
    
    return cities.map((item: any) => item.city);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
};
