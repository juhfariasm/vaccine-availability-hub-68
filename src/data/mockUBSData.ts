
export const mockUBSData = [
  {
    id: 1,
    name: 'UBS Vila Nova',
    address: 'Rua das Flores, 123',
    distance: 1.2,
    status: 'open',
    openingHours: '07:00 - 19:00',
    vaccines: {
      "COVID-19": true,
      "Gripe": true,
      "Febre Amarela": false,
      "Tétano": true,
      "Hepatite B": true,
      "Sarampo": false
    }
  },
  {
    id: 2,
    name: 'UBS Central',
    address: 'Av. Principal, 500',
    distance: 1.8,
    status: 'open',
    openingHours: '08:00 - 18:00',
    vaccines: {
      "COVID-19": true,
      "Gripe": false,
      "Febre Amarela": true,
      "Tétano": true,
      "Hepatite B": false,
      "Sarampo": true
    }
  },
  {
    id: 3,
    name: 'UBS Jardim América',
    address: 'Rua dos Ipês, 78',
    distance: 2.5,
    status: 'open',
    openingHours: '07:00 - 17:00',
    vaccines: {
      "COVID-19": false,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": false,
      "Hepatite B": true,
      "Sarampo": true
    }
  },
  {
    id: 4,
    name: 'UBS Parque das Árvores',
    address: 'Alameda dos Cedros, 45',
    distance: 3.1,
    status: 'open',
    openingHours: '08:00 - 20:00',
    vaccines: {
      "COVID-19": true,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": true,
      "Hepatite B": true,
      "Sarampo": false
    }
  },
  {
    id: 5,
    name: 'UBS São João',
    address: 'Rua dos Pinheiros, 89',
    distance: 3.5,
    status: 'open',
    openingHours: '07:00 - 17:00',
    vaccines: {
      "COVID-19": true,
      "Gripe": false,
      "Febre Amarela": false,
      "Tétano": true,
      "Hepatite B": false,
      "Sarampo": true
    }
  },
  {
    id: 6,
    name: 'UBS Boa Vista',
    address: 'Av. das Palmeiras, 321',
    distance: 4.2,
    status: 'closed',
    openingHours: '08:00 - 18:00',
    vaccines: {
      "COVID-19": false,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": false,
      "Hepatite B": true,
      "Sarampo": false
    }
  }
];

export const vaccinesList = ["COVID-19", "Gripe", "Febre Amarela", "Tétano", "Hepatite B", "Sarampo"];

export const citiesList = ["Teresina", "Timon", "Demerval Lobão"];

export type UBSData = typeof mockUBSData[0];
