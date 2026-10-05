export interface CityInfo {
  name: string;
}

export interface LocalGovtInfo {
  name: string;
  cities?: string[];
}

export interface StateProvinceInfo {
  name: string;
  code?: string;
  localGovts: LocalGovtInfo[];
  defaultCities?: string[];
}

export interface CountryInfo {
  name: string;
  code: string; // ISO 2-letter
  dialCode: string; // Calling prefix, e.g. +234
  flag: string; // Emoji flag
  currencyCode: string;
  states: StateProvinceInfo[];
}

export const WORLD_COUNTRIES: CountryInfo[] = [
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    flag: '🇳🇬',
    currencyCode: 'NGN',
    states: [
      {
        name: 'Lagos',
        code: 'LA',
        localGovts: [
          {
            name: 'Ikeja (State Capital)',
            cities: ['Ikeja GRA', 'Alausa', 'Maryland', 'Allen Avenue', 'Opebi', 'Computer Village'],
          },
          {
            name: 'Eti-Osa',
            cities: ['Victoria Island', 'Lekki Phase 1', 'Ikoyi', 'Oniru', 'Banana Island', 'Ajah', 'Sangotedo'],
          },
          {
            name: 'Lagos Island',
            cities: ['Marina', 'Broad Street', 'Idumota', 'TBS', 'Obalende'],
          },
          {
            name: 'Surulere',
            cities: ['Adeniran Ogunsanya', 'Bode Thomas', 'National Stadium', 'Aguda', 'Masha'],
          },
          {
            name: 'Ibeju-Lekki',
            cities: ['Eleko', 'Free Trade Zone', 'Dangote Refinery Area', 'Bogije', 'Lakowe'],
          },
          {
            name: 'Kosofe',
            cities: ['Magodo Phase 1 & 2', 'Gbagada', 'Ketu', 'Ojota', 'Ogudu GRA'],
          },
          {
            name: 'Alimosho',
            cities: ['Egbeda', 'Idimu', 'Ipaja', 'Igando', 'Gowon Estate'],
          },
          {
            name: 'Ikorodu',
            cities: ['Ikorodu Central', 'Igbogbo', 'Agbede', 'Ebute', 'Imota'],
          },
          {
            name: 'Oshodi-Isolo',
            cities: ['Ajao Estate', 'Isolo Industrial', 'Mafoluku', 'Okota'],
          },
          {
            name: 'Apapa',
            cities: ['Apapa Wharf', 'Apapa GRA', 'Tincan Island', 'Liverpool'],
          },
          {
            name: 'Amuwo-Odofin',
            cities: ['Festac Town', 'Amuwo GRA', 'Satellite Town', 'Apple Junction'],
          },
          {
            name: 'Agege',
            cities: ['Pen Cinema', 'Dopemu', 'Orile Agege', 'Tabon Tabon'],
          },
          {
            name: 'Somolu / Yaba',
            cities: ['Yaba Tech Hub', 'Sabo', 'Akoka', 'Fola Agoro', 'Fadeyi'],
          },
        ],
      },
      {
        name: 'Abuja (Federal Capital Territory)',
        code: 'FC',
        localGovts: [
          {
            name: 'Abuja Municipal (AMAC)',
            cities: ['Wuse 2', 'Maitama', 'Garki 2', 'Asokoro', 'Central Business District', 'Jabi', 'Utako', 'Apo', 'Guzape', 'Gudu'],
          },
          {
            name: 'Bwari Area Council',
            cities: ['Bwari Town', 'Kubwa', 'Dutse Alhaji', 'Dawaki', 'Ushafa'],
          },
          {
            name: 'Gwagwalada Area Council',
            cities: ['Gwagwalada Central', 'University Teaching Hospital Area', 'Zuba', 'Paiko'],
          },
          {
            name: 'Kuje Area Council',
            cities: ['Kuje Central', 'Chibiri', 'Gaube', 'Rubochi'],
          },
          {
            name: 'Kwali Area Council',
            cities: ['Kwali Town', 'Ashara', 'Dafa', 'Kilankwa'],
          },
          {
            name: 'Abaji Area Council',
            cities: ['Abaji Central', 'Nuku', 'Rimba', 'Gawu'],
          },
        ],
      },
      {
        name: 'Rivers',
        code: 'RI',
        localGovts: [
          {
            name: 'Port Harcourt City',
            cities: ['Old GRA', 'New GRA (Phases 1-4)', 'D-Line', 'Town', 'Diobu', 'Silverbird Area'],
          },
          {
            name: 'Obio-Akpor',
            cities: ['Peter Odili Road', 'Trans-Amadi Industrial', 'Rumuola', 'Rumuokoro', 'Woji', 'Eliozu', 'Choba (Uniport)'],
          },
          {
            name: 'Eleme',
            cities: ['Alesa', 'Alode', 'Onne Free Zone', 'Refinery Junction'],
          },
          {
            name: 'Ikwerre',
            cities: ['Isiokpo', 'Aluu', 'Airport Junction', 'Omuanwa'],
          },
          {
            name: 'Oyigbo',
            cities: ['Oyigbo West', 'Komkom', 'Mirinwanyi'],
          },
          {
            name: 'Bonny',
            cities: ['Bonny Island', 'NLNG Area', 'Finima'],
          },
        ],
      },
      {
        name: 'Oyo',
        code: 'OY',
        localGovts: [
          {
            name: 'Ibadan North',
            cities: ['Bodija Estate', 'University of Ibadan (UI)', 'Agodi GRA', 'Samonda', 'Sango'],
          },
          {
            name: 'Ibadan South-West',
            cities: ['Ring Road', 'Oluyole Estate', 'Challenge', 'Oke-Ado'],
          },
          {
            name: 'Ibadan North-West',
            cities: ['Dugbe Commercial Hub', 'Jericho GRA', 'Eleyele', 'Onireke'],
          },
          {
            name: 'Ogbomoso North / South',
            cities: ['Ogbomoso Central', 'LAUTECH Area', 'Arowomole'],
          },
        ],
      },
      {
        name: 'Kano',
        code: 'KN',
        localGovts: [
          {
            name: 'Kano Municipal',
            cities: ['Kano City Center', 'Kofar Nassarawa', 'Emir Palace Area', 'Sabon Gari'],
          },
          {
            name: 'Nassarawa',
            cities: ['Bompai Industrial Area', 'Nassarawa GRA', 'Airport Road'],
          },
          {
            name: 'Fagge',
            cities: ['Fagge Waje', 'Kantin Kwari Textile Market', 'Jaba'],
          },
          {
            name: 'Tarauni',
            cities: ['Gyadi-Gyadi', 'Hotoro GRA', 'Unguwa Uku'],
          },
        ],
      },
      {
        name: 'Ogun',
        code: 'OG',
        localGovts: [
          {
            name: 'Abeokuta South / North',
            cities: ['Abeokuta GRA', 'Oke-Mosan', 'Ibara', 'Asero', 'Panseke'],
          },
          {
            name: 'Ota / Ado-Odo',
            cities: ['Ota Industrial', 'Sango Ota', 'Covenant University Area'],
          },
          {
            name: 'Sagamu',
            cities: ['Sagamu Central', 'Interchange Area', 'Makun'],
          },
          {
            name: 'Ijebu Ode',
            cities: ['Ijebu Ode GRA', 'Igbeba', 'Molipa'],
          },
        ],
      },
      {
        name: 'Delta',
        code: 'DE',
        localGovts: [
          {
            name: 'Warri South',
            cities: ['Warri GRA', 'Effurun', 'Airport Road', 'Edjeba'],
          },
          {
            name: 'Oshimili South (Asaba)',
            cities: ['Asaba GRA', 'Nnebisi Road', 'Summit Road', 'Airport Area'],
          },
          {
            name: 'Uvwie',
            cities: ['Effurun Roundabout', 'PTI Area', 'Delta Mall Area'],
          },
        ],
      },
      {
        name: 'Anambra',
        code: 'AN',
        localGovts: [
          {
            name: 'Awka South (Capital)',
            cities: ['Awka GRA', 'Ziks Avenue', 'UNIZIK Area', 'Aroma Junction'],
          },
          {
            name: 'Onitsha North / South',
            cities: ['Main Market Area', 'Onitsha GRA', 'Fegge', 'Bridge Head'],
          },
          {
            name: 'Nnewi North',
            cities: ['Nnewi Commercial', 'Otolo', 'Nkwo Nnewi Area'],
          },
        ],
      },
      {
        name: 'Enugu',
        code: 'EN',
        localGovts: [
          {
            name: 'Enugu North',
            cities: ['Independence Layout', 'New Haven', 'Ogui Road', 'Coal Camp'],
          },
          {
            name: 'Enugu East',
            cities: ['Trans-Ekulu', 'Abakpa Nike', 'Emene Industrial'],
          },
          {
            name: 'Enugu South',
            cities: ['Achara Layout', 'Uwani', 'Gariki'],
          },
        ],
      },
      {
        name: 'Edo',
        code: 'ED',
        localGovts: [
          {
            name: 'Oredo (Benin City)',
            cities: ['Benin GRA', 'Airport Road', 'Ring Road', 'Sapele Road'],
          },
          {
            name: 'Ikpoba-Okha',
            cities: ['Aduwawa', 'Upper Sakponba', 'Ikpoba Hill'],
          },
          {
            name: 'Egor',
            cities: ['Uselu', 'UNIBEN Ugbowo Campus Area'],
          },
        ],
      },
      {
        name: 'Kaduna',
        code: 'KD',
        localGovts: [
          {
            name: 'Kaduna North',
            cities: ['Kaduna GRA', 'Barnawa', 'Ungwan Rimi', 'Malali GRA', 'Kawo'],
          },
          {
            name: 'Kaduna South',
            cities: ['Kakuri Industrial', 'Sabon Tasha', 'Tudun Wada'],
          },
          {
            name: 'Zaria',
            cities: ['Samaru (ABU Area)', 'Sabon Gari Zaria', 'Tudun Jukun'],
          },
        ],
      },
      {
        name: 'Plateau',
        code: 'PL',
        localGovts: [
          {
            name: 'Jos North / South',
            cities: ['Rayfield GRA', 'Jos Terminus', 'Bukuru', 'Lamingo', 'Anglo Jos'],
          },
        ],
      },
      {
        name: 'Akwa Ibom',
        code: 'AK',
        localGovts: [
          {
            name: 'Uyo (Capital)',
            cities: ['Uyo E-Library Area', 'Oron Road', 'Shelter Afrique Estate', 'Four Lanes'],
          },
          {
            name: 'Eket',
            cities: ['Eket Urban', 'Mobil Airstrip Area', 'Afaha Eket'],
          },
        ],
      },
      {
        name: 'Imo',
        code: 'IM',
        localGovts: [
          {
            name: 'Owerri Municipal / North / West',
            cities: ['Owerri New Owerri Area', 'World Bank Estate', 'Ikenegbu Layout', 'Aladinma'],
          },
        ],
      },
      {
        name: 'Kwara',
        code: 'KW',
        localGovts: [
          {
            name: 'Ilorin South / West / East',
            cities: ['GRA Ilorin', 'Fate Road', 'Tanke (Unilorin Area)', 'Taiwo Road'],
          },
        ],
      },
      {
        name: 'Abia',
        code: 'AB',
        localGovts: [
          {
            name: 'Aba North / South',
            cities: ['Ariaria Market Area', 'Aba Commercial Center', 'Faulks Road'],
          },
          {
            name: 'Umuahia North / South',
            cities: ['Umuahia GRA', 'Bank Road', 'Bende Road'],
          },
        ],
      },
      {
        name: 'Cross River',
        code: 'CR',
        localGovts: [
          {
            name: 'Calabar Municipal / South',
            cities: ['State Housing Estate', 'Marian Road', 'Tinapa Area', 'MCC Road'],
          },
        ],
      },
      {
        name: 'Ondo',
        code: 'ON',
        localGovts: [
          {
            name: 'Akure South / North',
            cities: ['Alagbaka GRA', 'Oyemekun Road', 'Oba Ile', 'FUTA Area'],
          },
        ],
      },
      {
        name: 'Osun',
        code: 'OS',
        localGovts: [
          {
            name: 'Osogbo',
            cities: ['Osogbo GRA', 'Ogo-Oluwa', 'Alekuwodo'],
          },
          {
            name: 'Ife Central (Ile-Ife)',
            cities: ['OAU Campus Area', 'Mayfair', 'Lagere'],
          },
        ],
      },
      {
        name: 'Benue',
        code: 'BE',
        localGovts: [
          {
            name: 'Makurdi',
            cities: ['High Level', 'Wurukum', 'North Bank', 'Modern Market Area'],
          },
        ],
      },
      {
        name: 'Borno',
        code: 'BO',
        localGovts: [
          {
            name: 'Maiduguri',
            cities: ['Maiduguri GRA', 'Customs Area', 'Post Office Area', 'University Area'],
          },
        ],
      },
      {
        name: 'Adamawa',
        code: 'AD',
        localGovts: [
          {
            name: 'Yola North / South',
            cities: ['Jimeta Urban', 'Yola Town', 'AUN Area', 'Karewa GRA'],
          },
        ],
      },
      {
        name: 'Bauchi',
        code: 'BA',
        localGovts: [
          {
            name: 'Bauchi',
            cities: ['Bauchi GRA', 'Wunti Market Area', 'Yelwa (ATBU Area)'],
          },
        ],
      },
      {
        name: 'Bayelsa',
        code: 'BY',
        localGovts: [
          {
            name: 'Yenagoa',
            cities: ['Yenagoa Amarata', 'Ovies Area', 'Kpansia', 'Etegwe'],
          },
        ],
      },
      {
        name: 'Ebonyi',
        code: 'EB',
        localGovts: [
          {
            name: 'Abakaliki',
            cities: ['Abakaliki Urban', 'Water Works Road', 'Kpirikpiri'],
          },
        ],
      },
      {
        name: 'Ekiti',
        code: 'EK',
        localGovts: [
          {
            name: 'Ado-Ekiti',
            cities: ['Ado GRA', 'Fajuyi', 'Ajilosun', 'Basiri'],
          },
        ],
      },
      {
        name: 'Gombe',
        code: 'GO',
        localGovts: [
          {
            name: 'Gombe',
            cities: ['Gombe GRA', 'Pantami', 'Commercial Area'],
          },
        ],
      },
      {
        name: 'Jigawa',
        code: 'JI',
        localGovts: [
          {
            name: 'Dutse',
            cities: ['Dutse Central', 'Takur', 'G9 Estate'],
          },
        ],
      },
      {
        name: 'Katsina',
        code: 'KT',
        localGovts: [
          {
            name: 'Katsina',
            cities: ['Katsina GRA', 'Kofar Kaura', 'Nagogo Road'],
          },
        ],
      },
      {
        name: 'Kebbi',
        code: 'KB',
        localGovts: [
          {
            name: 'Birnin Kebbi',
            cities: ['Birnin Kebbi GRA', 'Haliru Abdu Secretariat Area', 'Gesse'],
          },
        ],
      },
      {
        name: 'Kogi',
        code: 'KO',
        localGovts: [
          {
            name: 'Lokoja',
            cities: ['Lokoja GRA', 'Ganaja Village Road', 'Phase 1 & 2 Estates'],
          },
        ],
      },
      {
        name: 'Nasarawa',
        code: 'NA',
        localGovts: [
          {
            name: 'Karu / Mararaba',
            cities: ['Mararaba Border City', 'Nyanya Border', 'Masaka', 'Auta Balefi'],
          },
          {
            name: 'Lafia',
            cities: ['Lafia Urban', 'College of Agric Area', 'Bukan Sidi'],
          },
        ],
      },
      {
        name: 'Niger',
        code: 'NI',
        localGovts: [
          {
            name: 'Minna',
            cities: ['Minna GRA', 'Chanchaga', 'Tunga', 'Bosso (FUTMinna Area)'],
          },
          {
            name: 'Suleja',
            cities: ['Suleja Town', 'Madalla', 'Gauraka'],
          },
        ],
      },
      {
        name: 'Sokoto',
        code: 'SO',
        localGovts: [
          {
            name: 'Sokoto North / South',
            cities: ['Sokoto GRA', 'Kano Road', 'Sultan Palace Area'],
          },
        ],
      },
      {
        name: 'Taraba',
        code: 'TA',
        localGovts: [
          {
            name: 'Jalingo',
            cities: ['Jalingo GRA', 'Mile 6', 'Road Block Area'],
          },
        ],
      },
      {
        name: 'Yobe',
        code: 'YO',
        localGovts: [
          {
            name: 'Damaturu',
            cities: ['Damaturu Urban', 'Nayilawa', 'Gujba Road'],
          },
        ],
      },
      {
        name: 'Zamfara',
        code: 'ZA',
        localGovts: [
          {
            name: 'Gusau',
            cities: ['Gusau GRA', 'Tudun Wada', 'Canteen Area'],
          },
        ],
      },
    ],
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    states: [
      {
        name: 'Greater London',
        localGovts: [
          {
            name: 'City of Westminster',
            cities: ['Westminster', 'Soho', 'Covent Garden', 'Mayfair', 'Paddington', 'Marylebone'],
          },
          {
            name: 'Camden',
            cities: ['Camden Town', 'Holborn', 'Kings Cross', 'Bloomsbury', 'Hampstead'],
          },
          {
            name: 'Tower Hamlets',
            cities: ['Canary Wharf', 'Whitechapel', 'Spitalfields', 'Bethnal Green'],
          },
          {
            name: 'Kensington & Chelsea',
            cities: ['South Kensington', 'Chelsea', 'Notting Hill', 'Earls Court'],
          },
          {
            name: 'Southwark & Lambeth',
            cities: ['London Bridge', 'Borough', 'Brixton', 'Waterloo', 'Clapham'],
          },
          {
            name: 'Greenwich & Lewisham',
            cities: ['Greenwich Town', 'North Greenwich', 'Blackheath', 'Lewisham'],
          },
        ],
      },
      {
        name: 'West Midlands',
        localGovts: [
          {
            name: 'Birmingham',
            cities: ['Birmingham City Centre', 'Digbeth', 'Jewellery Quarter', 'Edgbaston', 'Solihull'],
          },
          {
            name: 'Coventry',
            cities: ['Coventry Centre', 'Earlsdon', 'Tile Hill'],
          },
        ],
      },
      {
        name: 'North West England',
        localGovts: [
          {
            name: 'Manchester',
            cities: ['Manchester City Centre', 'Northern Quarter', 'Deansgate', 'Didsbury', 'Salford'],
          },
          {
            name: 'Liverpool',
            cities: ['Liverpool City Centre', 'Albert Dock Area', 'Baltic Triangle'],
          },
        ],
      },
      {
        name: 'Scotland',
        localGovts: [
          {
            name: 'Glasgow',
            cities: ['Glasgow City Centre', 'West End', 'Merchant City', 'Southside'],
          },
          {
            name: 'Edinburgh',
            cities: ['Old Town', 'New Town', 'Leith', 'Stockbridge'],
          },
        ],
      },
      {
        name: 'Wales',
        localGovts: [
          {
            name: 'Cardiff',
            cities: ['Cardiff City Centre', 'Cardiff Bay', 'Canton', 'Roath'],
          },
        ],
      },
    ],
  },
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    currencyCode: 'USD',
    states: [
      {
        name: 'Texas',
        code: 'TX',
        localGovts: [
          {
            name: 'Harris County (Houston)',
            cities: ['Downtown Houston', 'Galleria Area', 'Montrose', 'The Heights', 'Katy', 'Sugar Land'],
          },
          {
            name: 'Dallas County',
            cities: ['Downtown Dallas', 'Uptown', 'Deep Ellum', 'Oak Lawn', 'Irving', 'Richardson'],
          },
          {
            name: 'Travis County (Austin)',
            cities: ['Downtown Austin', 'South Congress', 'East Austin', 'Domain Area'],
          },
        ],
      },
      {
        name: 'California',
        code: 'CA',
        localGovts: [
          {
            name: 'Los Angeles County',
            cities: ['Downtown LA', 'Hollywood', 'Santa Monica', 'Pasadena', 'Long Beach', 'Glendale'],
          },
          {
            name: 'Orange County',
            cities: ['Irvine', 'Anaheim', 'Santa Ana', 'Newport Beach'],
          },
          {
            name: 'San Francisco County',
            cities: ['SoMa', 'Financial District', 'Mission District', 'Marina'],
          },
        ],
      },
      {
        name: 'New York',
        code: 'NY',
        localGovts: [
          {
            name: 'New York County (Manhattan)',
            cities: ['Midtown', 'Lower Manhattan', 'Upper East Side', 'Chelsea', 'Harlem', 'SoHo'],
          },
          {
            name: 'Kings County (Brooklyn)',
            cities: ['Williamsburg', 'DUMBO', 'Brooklyn Heights', 'Park Slope', 'Bushwick'],
          },
          {
            name: 'Queens County',
            cities: ['Astoria', 'Long Island City', 'Flushing', 'Forest Hills'],
          },
        ],
      },
      {
        name: 'Georgia',
        code: 'GA',
        localGovts: [
          {
            name: 'Fulton County (Atlanta)',
            cities: ['Downtown Atlanta', 'Midtown Atlanta', 'Buckhead', 'Alpharetta', 'Sandy Springs'],
          },
          {
            name: 'Gwinnett County',
            cities: ['Duluth', 'Norcross', 'Lawrenceville', 'Suwanee'],
          },
        ],
      },
      {
        name: 'Florida',
        code: 'FL',
        localGovts: [
          {
            name: 'Miami-Dade County',
            cities: ['Brickell', 'Downtown Miami', 'South Beach', 'Coral Gables', 'Wynwood', 'Doral'],
          },
          {
            name: 'Orange County (Orlando)',
            cities: ['Downtown Orlando', 'Winter Park', 'International Drive Area'],
          },
        ],
      },
      {
        name: 'Illinois',
        code: 'IL',
        localGovts: [
          {
            name: 'Cook County (Chicago)',
            cities: ['The Loop', 'River North', 'West Loop', 'Lincoln Park', 'Wicker Park', 'Hyde Park'],
          },
        ],
      },
      {
        name: 'Maryland / DC Metro',
        code: 'MD',
        localGovts: [
          {
            name: 'Prince George’s County',
            cities: ['Bowie', 'Hyattsville', 'Laurel', 'College Park', 'National Harbor'],
          },
          {
            name: 'Montgomery County',
            cities: ['Silver Spring', 'Bethesda', 'Rockville', 'Gaithersburg'],
          },
        ],
      },
    ],
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    states: [
      {
        name: 'Ontario',
        code: 'ON',
        localGovts: [
          {
            name: 'City of Toronto',
            cities: ['Downtown Toronto', 'North York', 'Scarborough', 'Etobicoke', 'Yorkville', 'Midtown'],
          },
          {
            name: 'Peel Region',
            cities: ['Mississauga', 'Brampton', 'Caledon'],
          },
          {
            name: 'York Region',
            cities: ['Markham', 'Vaughan', 'Richmond Hill'],
          },
          {
            name: 'Ottawa (National Capital)',
            cities: ['Downtown Ottawa', 'ByWard Market', 'Kanata', 'Nepean'],
          },
        ],
      },
      {
        name: 'British Columbia',
        code: 'BC',
        localGovts: [
          {
            name: 'Metro Vancouver',
            cities: ['Vancouver Downtown', 'Burnaby', 'Richmond', 'Surrey', 'Coquitlam'],
          },
        ],
      },
      {
        name: 'Alberta',
        code: 'AB',
        localGovts: [
          {
            name: 'Calgary Region',
            cities: ['Downtown Calgary', 'Beltline', 'Kensington', 'NW Calgary'],
          },
          {
            name: 'Edmonton Region',
            cities: ['Downtown Edmonton', 'Strathcona', 'Oliver'],
          },
        ],
      },
    ],
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialCode: '+233',
    flag: '🇬🇭',
    currencyCode: 'GHS',
    states: [
      {
        name: 'Greater Accra',
        localGovts: [
          {
            name: 'Accra Metropolitan',
            cities: ['Osu', 'Airport Residential', 'East Legon', 'Cantonments', 'Labone', 'Dzorwulu', 'Ridge'],
          },
          {
            name: 'Tema Metropolitan',
            cities: ['Tema Community 1', 'Tema Community 25', 'Sakumono', 'Spintex Road'],
          },
          {
            name: 'Ga East / West',
            cities: ['Madina', 'Adenta', 'Haatso', 'Dome', 'Achimota'],
          },
        ],
      },
      {
        name: 'Ashanti',
        localGovts: [
          {
            name: 'Kumasi Metropolitan',
            cities: ['Adum Commercial', 'Bantama', 'Asokwa', 'KNUST Campus Area', 'Nhyiaeso'],
          },
        ],
      },
      {
        name: 'Western',
        localGovts: [
          {
            name: 'Sekondi-Takoradi',
            cities: ['Takoradi Harbor Area', 'Market Circle', 'Anaji'],
          },
        ],
      },
    ],
  },
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪',
    currencyCode: 'KES',
    states: [
      {
        name: 'Nairobi County',
        localGovts: [
          {
            name: 'Westlands Sub-County',
            cities: ['Westlands Commercial', 'Parklands', 'Lavington', 'Kitisuru', 'Spring Valley'],
          },
          {
            name: 'Dagoretti / Kilimani',
            cities: ['Kilimani', 'Kileleshwa', 'Hurlingham', 'Yaya Center Area'],
          },
          {
            name: 'Langata',
            cities: ['Karen', 'Langata Road', 'Nairobi West'],
          },
          {
            name: 'Nairobi Central',
            cities: ['Nairobi CBD', 'Upper Hill Financial District', 'Ngara'],
          },
        ],
      },
      {
        name: 'Mombasa County',
        localGovts: [
          {
            name: 'Nyali / Mvita',
            cities: ['Nyali Beach', 'Mombasa Island', 'Kizingo', 'Bamburi'],
          },
        ],
      },
      {
        name: 'Kisumu County',
        localGovts: [
          {
            name: 'Kisumu Central',
            cities: ['Milimani Estate', 'Kisumu CBD', 'Kondele'],
          },
        ],
      },
    ],
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    flag: '🇿🇦',
    currencyCode: 'ZAR',
    states: [
      {
        name: 'Gauteng',
        localGovts: [
          {
            name: 'City of Johannesburg',
            cities: ['Sandton CBD', 'Rosebank', 'Melrose Arch', 'Fourways', 'Braamfontein', 'Midrand'],
          },
          {
            name: 'City of Tshwane (Pretoria)',
            cities: ['Pretoria Central', 'Menlyn', 'Brooklyn', 'Hatfield', 'Centurion'],
          },
        ],
      },
      {
        name: 'Western Cape',
        localGovts: [
          {
            name: 'City of Cape Town',
            cities: ['Cape Town CBD', 'V&A Waterfront', 'Camps Bay', 'Green Point', 'Claremont', 'Century City'],
          },
        ],
      },
      {
        name: 'KwaZulu-Natal',
        localGovts: [
          {
            name: 'eThekwini (Durban)',
            cities: ['Umhlanga Rocks', 'Durban North', 'Florida Road', 'Morningside', 'Ballito'],
          },
        ],
      },
    ],
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialCode: '+971',
    flag: '🇦🇪',
    currencyCode: 'AED',
    states: [
      {
        name: 'Dubai',
        localGovts: [
          {
            name: 'Dubai Central & Financial',
            cities: ['Downtown Dubai', 'Business Bay', 'DIFC', 'City Walk', 'Deira', 'Bur Dubai'],
          },
          {
            name: 'Dubai Marina & Coast',
            cities: ['Dubai Marina', 'Jumeirah Beach Residence (JBR)', 'Palm Jumeirah', 'Jumeirah 1, 2, 3'],
          },
          {
            name: 'New Dubai Hubs',
            cities: ['Dubai Hills Estate', 'Barsha Heights (TECOM)', 'Al Barsha', 'Silicon Oasis', 'JVC'],
          },
        ],
      },
      {
        name: 'Abu Dhabi',
        localGovts: [
          {
            name: 'Abu Dhabi Municipality',
            cities: ['Corniche Area', 'Al Reem Island', 'Yas Island', 'Saadiyat Island', 'Al Maryah Island', 'Khalifa City'],
          },
        ],
      },
      {
        name: 'Sharjah',
        localGovts: [
          {
            name: 'Sharjah Municipality',
            cities: ['Al Majaz Waterfront', 'Al Nahda', 'Al Qasimia', 'University City'],
          },
        ],
      },
    ],
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        localGovts: [
          {
            name: 'City of Sydney',
            cities: ['Sydney CBD', 'Surry Hills', 'Darlinghurst', 'Barangaroo', 'Bondi Beach', 'Parramatta'],
          },
        ],
      },
      {
        name: 'Victoria',
        code: 'VIC',
        localGovts: [
          {
            name: 'City of Melbourne',
            cities: ['Melbourne CBD', 'Fitzroy', 'Southbank', 'St Kilda', 'Carlton', 'Docklands'],
          },
        ],
      },
      {
        name: 'Queensland',
        code: 'QLD',
        localGovts: [
          {
            name: 'City of Brisbane',
            cities: ['Brisbane CBD', 'Fortitude Valley', 'South Bank', 'Gold Coast - Surfers Paradise'],
          },
        ],
      },
    ],
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    states: [
      {
        name: 'Berlin',
        localGovts: [
          {
            name: 'Berlin Mitte & City',
            cities: ['Mitte', 'Kreuzberg', 'Charlottenburg', 'Prenzlauer Berg', 'Friedrichshain'],
          },
        ],
      },
      {
        name: 'Bavaria (Bayern)',
        localGovts: [
          {
            name: 'Munich (München)',
            cities: ['Altstadt-Lehel', 'Maxvorstadt', 'Schwabing', 'Sendling'],
          },
        ],
      },
      {
        name: 'North Rhine-Westphalia',
        localGovts: [
          {
            name: 'Cologne & Düsseldorf',
            cities: ['Köln Innenstadt', 'Düsseldorf Altstadt', 'MedienHafen'],
          },
        ],
      },
      {
        name: 'Hesse (Hessen)',
        localGovts: [
          {
            name: 'Frankfurt am Main',
            cities: ['Frankfurt Bankenviertel', 'Bornheim', 'Sachsenhausen'],
          },
        ],
      },
    ],
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    flag: '🇫🇷',
    currencyCode: 'EUR',
    states: [
      {
        name: 'Île-de-France (Paris)',
        localGovts: [
          {
            name: 'Paris Central Arrondissements',
            cities: ['Paris 1er (Louvre)', 'Paris 8e (Champs-Élysées)', 'Paris 2e (Opéra)', 'Paris 4e (Marais)', 'Paris 16e'],
          },
          {
            name: 'Hauts-de-Seine',
            cities: ['La Défense Business District', 'Boulogne-Billancourt', 'Neuilly-sur-Seine'],
          },
        ],
      },
      {
        name: 'Provence-Alpes-Côte d’Azur',
        localGovts: [
          {
            name: 'Nice & French Riviera',
            cities: ['Nice Promenade', 'Cannes Croisette', 'Marseille Vieux-Port'],
          },
        ],
      },
    ],
  },
  {
    name: 'Ireland',
    code: 'IE',
    dialCode: '+353',
    flag: '🇮🇪',
    currencyCode: 'EUR',
    states: [
      {
        name: 'Leinster (Dublin)',
        localGovts: [
          {
            name: 'Dublin City',
            cities: ['Dublin 2 (Grafton St & Temple Bar)', 'Dublin 1', 'Grand Canal Dock Tech Hub', 'Ranelagh', 'Ballsbridge'],
          },
        ],
      },
      {
        name: 'Munster (Cork)',
        localGovts: [
          {
            name: 'Cork City',
            cities: ['Cork City Centre', 'Douglas', 'Ballincollig'],
          },
        ],
      },
    ],
  },
  {
    name: 'Cameroon',
    code: 'CM',
    dialCode: '+237',
    flag: '🇨🇲',
    currencyCode: 'XAF',
    states: [
      {
        name: 'Littoral (Douala)',
        localGovts: [
          {
            name: 'Douala Central',
            cities: ['Bonanjo Financial', 'Akwa Commercial', 'Bonapriso', 'Deido'],
          },
        ],
      },
      {
        name: 'Centre (Yaoundé)',
        localGovts: [
          {
            name: 'Yaoundé Central',
            cities: ['Bastos Diplomatic Area', 'Centre-ville', 'Omnisports Area'],
          },
        ],
      },
    ],
  },
  {
    name: 'Côte d’Ivoire',
    code: 'CI',
    dialCode: '+225',
    flag: '🇨🇮',
    currencyCode: 'XOF',
    states: [
      {
        name: 'Abidjan Autonomous District',
        localGovts: [
          {
            name: 'Cocody & Plateau',
            cities: ['Plateau Commercial', 'Cocody Deux-Plateaux', 'Riviera Golf', 'Zone 4 Marcory'],
          },
        ],
      },
    ],
  },
  {
    name: 'Rwanda',
    code: 'RW',
    dialCode: '+250',
    flag: '🇷🇼',
    currencyCode: 'RWF',
    states: [
      {
        name: 'Kigali City',
        localGovts: [
          {
            name: 'Nyarugenge & Gasabo',
            cities: ['Kigali CBD', 'Kimihurura', 'Kacyiru', 'Nyarutarama', 'Gishushu'],
          },
        ],
      },
    ],
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialCode: '+966',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    states: [
      {
        name: 'Riyadh Province',
        localGovts: [
          {
            name: 'Riyadh Municipality',
            cities: ['Al Olaya', 'King Abdullah Financial District (KAFD)', 'Al Malqa', 'Al Nakheel'],
          },
        ],
      },
      {
        name: 'Makkah Province (Jeddah)',
        localGovts: [
          {
            name: 'Jeddah Municipality',
            cities: ['Jeddah Corniche', 'Al Rawdah', 'Al Shati', 'Al Hamra'],
          },
        ],
      },
    ],
  },
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    flag: '🇮🇳',
    currencyCode: 'INR',
    states: [
      {
        name: 'Maharashtra',
        localGovts: [
          {
            name: 'Mumbai City & Suburban',
            cities: ['Bandra West', 'Andheri West', 'Colaba', 'Juhu', 'Powai', 'Lower Parel'],
          },
          {
            name: 'Pune District',
            cities: ['Koregaon Park', 'Kothrud', 'Baner', 'Viman Nagar', 'Hinjawadi'],
          },
        ],
      },
      {
        name: 'Delhi NCR',
        localGovts: [
          {
            name: 'New Delhi',
            cities: ['Connaught Place', 'Hauz Khas', 'Saket', 'Vasant Kunj', 'Greater Kailash'],
          },
          {
            name: 'Gurugram (Gurgaon)',
            cities: ['Cyber City', 'Golf Course Road', 'Sector 29', 'Sohna Road'],
          },
        ],
      },
      {
        name: 'Karnataka',
        localGovts: [
          {
            name: 'Bengaluru Urban (Bangalore)',
            cities: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'MG Road', 'Jayanagar'],
          },
        ],
      },
      {
        name: 'Tamil Nadu',
        localGovts: [
          {
            name: 'Chennai District',
            cities: ['T. Nagar', 'Anna Nagar', 'Nungambakkam', 'Adyar', 'Alwarpet'],
          },
        ],
      },
    ],
  },
  {
    name: 'Netherlands',
    code: 'NL',
    dialCode: '+31',
    flag: '🇳🇱',
    currencyCode: 'EUR',
    states: [
      {
        name: 'North Holland (Noord-Holland)',
        localGovts: [
          {
            name: 'Amsterdam Municipality',
            cities: ['Amsterdam Centrum', 'De Pijp', 'Zuid', 'West', 'Jordaan'],
          },
          {
            name: 'Haarlem',
            cities: ['Haarlem Centrum', 'Grote Markt', 'Klevarpark'],
          },
        ],
      },
      {
        name: 'South Holland (Zuid-Holland)',
        localGovts: [
          {
            name: 'Rotterdam Municipality',
            cities: ['Rotterdam Centrum', 'Kop van Zuid', 'Kralingen'],
          },
          {
            name: 'The Hague (Den Haag)',
            cities: ['Scheveningen', 'Den Haag Centrum', 'Statenkwartier'],
          },
        ],
      },
      {
        name: 'Utrecht',
        localGovts: [
          {
            name: 'Utrecht Municipality',
            cities: ['Binnenstad', 'Oudegracht', 'Leidsche Rijn'],
          },
        ],
      },
    ],
  },
  {
    name: 'Spain',
    code: 'ES',
    dialCode: '+34',
    flag: '🇪🇸',
    currencyCode: 'EUR',
    states: [
      {
        name: 'Community of Madrid',
        localGovts: [
          {
            name: 'Madrid Central District',
            cities: ['Sol & Gran Vía', 'Salamanca', 'Chamberí', 'Malasaña', 'Chueca'],
          },
        ],
      },
      {
        name: 'Catalonia',
        localGovts: [
          {
            name: 'Barcelona Province',
            cities: ['Eixample', 'Gothic Quarter', 'Gràcia', 'Poblenou', 'Sarrià'],
          },
        ],
      },
      {
        name: 'Andalusia',
        localGovts: [
          {
            name: 'Seville & Malaga',
            cities: ['Seville Casco Antiguo', 'Malaga Centro', 'Marbella Puerto Banús'],
          },
        ],
      },
    ],
  },
  {
    name: 'Italy',
    code: 'IT',
    dialCode: '+39',
    flag: '🇮🇹',
    currencyCode: 'EUR',
    states: [
      {
        name: 'Lombardy',
        localGovts: [
          {
            name: 'Metropolitan City of Milan',
            cities: ['Milan Centro Storico', 'Brera', 'Navigli', 'Porta Nuova', 'Isola'],
          },
        ],
      },
      {
        name: 'Lazio',
        localGovts: [
          {
            name: 'Metropolitan City of Rome',
            cities: ['Trastevere', 'Piazza Navona Area', 'Monti', 'Prati', 'Parioli'],
          },
        ],
      },
      {
        name: 'Tuscany',
        localGovts: [
          {
            name: 'Florence (Firenze)',
            cities: ['Firenze Historic Centre', 'Oltrarno', 'Santa Croce'],
          },
        ],
      },
    ],
  },
  {
    name: 'Switzerland',
    code: 'CH',
    dialCode: '+41',
    flag: '🇨🇭',
    currencyCode: 'CHF',
    states: [
      {
        name: 'Canton of Zurich',
        localGovts: [
          {
            name: 'Zurich District',
            cities: ['Altstadt (Old Town)', 'Enge', 'Wiedikon', 'Zurich West', 'Oerlikon'],
          },
        ],
      },
      {
        name: 'Canton of Geneva',
        localGovts: [
          {
            name: 'Geneva Municipality',
            cities: ['Geneva Downtown', 'Pâquis', 'Eaux-Vives', 'Plainpalais'],
          },
        ],
      },
    ],
  },
  {
    name: 'Qatar',
    code: 'QA',
    dialCode: '+974',
    flag: '🇶🇦',
    currencyCode: 'QAR',
    states: [
      {
        name: 'Doha Municipality',
        localGovts: [
          {
            name: 'Doha Central & Pearl',
            cities: ['The Pearl-Qatar', 'West Bay', 'Souq Waqif District', 'Msheireb Downtown', 'Lusail Marina'],
          },
        ],
      },
      {
        name: 'Al Rayyan Municipality',
        localGovts: [
          {
            name: 'Al Rayyan Metro',
            cities: ['Education City', 'Aspire Zone', 'Al Waab'],
          },
        ],
      },
    ],
  },
  {
    name: 'Kuwait',
    code: 'KW',
    dialCode: '+965',
    flag: '🇰🇼',
    currencyCode: 'KWD',
    states: [
      {
        name: 'Capital Governorate (Al Asimah)',
        localGovts: [
          {
            name: 'Kuwait City District',
            cities: ['Sharq', 'Salhiya', 'Qibla', 'Mirqab', 'Shuwaikh Industrial'],
          },
        ],
      },
      {
        name: 'Hawalli Governorate',
        localGovts: [
          {
            name: 'Hawalli & Salmiya',
            cities: ['Salmiya Coastal', 'Hawalli Commercial', 'Jabriya'],
          },
        ],
      },
    ],
  },
  {
    name: 'Uganda',
    code: 'UG',
    dialCode: '+256',
    flag: '🇺🇬',
    currencyCode: 'UGX',
    states: [
      {
        name: 'Central Region (Kampala)',
        localGovts: [
          {
            name: 'Kampala Capital City Authority (KCCA)',
            cities: ['Kololo', 'Nakasero', 'Bugolobi', 'Ntinda', 'Naguru', 'Kabalagala', 'Muyenga'],
          },
          {
            name: 'Wakiso District',
            cities: ['Entebbe Town', 'Nansana', 'Kira', 'Namugongo'],
          },
        ],
      },
    ],
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    dialCode: '+255',
    flag: '🇹🇿',
    currencyCode: 'TZS',
    states: [
      {
        name: 'Dar es Salaam Region',
        localGovts: [
          {
            name: 'Kinondoni & Ilala',
            cities: ['Oysterbay', 'Masaki (Peninsula)', 'Kariakoo', 'Posta (CBD)', 'Mikocheni', 'Mbezi Beach'],
          },
        ],
      },
      {
        name: 'Arusha Region',
        localGovts: [
          {
            name: 'Arusha City',
            cities: ['Clock Tower CBD', 'Njiro', 'Sekei'],
          },
        ],
      },
      {
        name: 'Zanzibar Urban/West',
        localGovts: [
          {
            name: 'Stone Town District',
            cities: ['Stone Town Waterfront', 'Michenzani', 'Nungwi Beach'],
          },
        ],
      },
    ],
  },
  {
    name: 'Zambia',
    code: 'ZM',
    dialCode: '+260',
    flag: '🇿🇲',
    currencyCode: 'ZMW',
    states: [
      {
        name: 'Lusaka Province',
        localGovts: [
          {
            name: 'Lusaka District',
            cities: ['Kabulonga', 'Rhodes Park', 'Woodlands', 'Cairo Road CBD', 'Mass Media'],
          },
        ],
      },
      {
        name: 'Copperbelt Province',
        localGovts: [
          {
            name: 'Ndola & Kitwe',
            cities: ['Ndola Central', 'Kitwe Town', 'Parklands'],
          },
        ],
      },
    ],
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    dialCode: '+263',
    flag: '🇿🇼',
    currencyCode: 'USD',
    states: [
      {
        name: 'Harare Province',
        localGovts: [
          {
            name: 'Harare Metropolitan',
            cities: ['Avondale', 'Borrowdale', 'Harare CBD', 'Belgravia', 'Highlands', 'Sam Levy Village'],
          },
        ],
      },
      {
        name: 'Bulawayo Province',
        localGovts: [
          {
            name: 'Bulawayo Central',
            cities: ['Bulawayo CBD', 'Suburbs', 'Kumalo', 'Hillside'],
          },
        ],
      },
    ],
  },
  {
    name: 'Benin',
    code: 'BJ',
    dialCode: '+229',
    flag: '🇧🇯',
    currencyCode: 'XOF',
    states: [
      {
        name: 'Littoral Department (Cotonou)',
        localGovts: [
          {
            name: 'Cotonou Central Arrondissements',
            cities: ['Haie Vive', 'Ganhi CBD', 'Cadjehoun', 'Fidjrossè', 'Akpakpa'],
          },
        ],
      },
      {
        name: 'Atlantique Department',
        localGovts: [
          {
            name: 'Abomey-Calavi',
            cities: ['Calavi Centre', 'Godomey', 'Arconville'],
          },
        ],
      },
    ],
  },
  {
    name: 'Togo',
    code: 'TG',
    dialCode: '+228',
    flag: '🇹🇬',
    currencyCode: 'XOF',
    states: [
      {
        name: 'Maritime Region (Lomé)',
        localGovts: [
          {
            name: 'Commune de Lomé (Golfe)',
            cities: ['Lomé Boulevard Circulaire', 'Nyékonakpoè', 'Bè', 'Tokoin', 'Baguida'],
          },
        ],
      },
    ],
  },
  {
    name: 'Senegal',
    code: 'SN',
    dialCode: '+221',
    flag: '🇸🇳',
    currencyCode: 'XOF',
    states: [
      {
        name: 'Dakar Region',
        localGovts: [
          {
            name: 'Dakar Ville & Almadies',
            cities: ['Les Almadies', 'Plateau (Dakar CBD)', 'Ngor', 'Fann Résidence', 'Mermoz', 'Ouakam'],
          },
        ],
      },
    ],
  },
  {
    name: 'Jamaica',
    code: 'JM',
    dialCode: '+1876',
    flag: '🇯🇲',
    currencyCode: 'JMD',
    states: [
      {
        name: 'Kingston & St. Andrew',
        localGovts: [
          {
            name: 'Kingston Metropolitan Area',
            cities: ['New Kingston', 'Half-Way-Tree', 'Liguanea', 'Norbrook', 'Downtown Kingston'],
          },
        ],
      },
      {
        name: 'St. James',
        localGovts: [
          {
            name: 'Montego Bay District',
            cities: ['Hip Strip (Gloucester Ave)', 'Rose Hall', 'Ironshore', 'Freeport'],
          },
        ],
      },
    ],
  },
  {
    name: 'Trinidad & Tobago',
    code: 'TT',
    dialCode: '+1868',
    flag: '🇹🇹',
    currencyCode: 'TTD',
    states: [
      {
        name: 'City of Port of Spain',
        localGovts: [
          {
            name: 'Port of Spain Metro',
            cities: ['Woodbrook (Aripita Ave)', 'St. Clair', 'Maraval', 'Downtown Port of Spain'],
          },
        ],
      },
      {
        name: 'San Fernando & Chaguanas',
        localGovts: [
          {
            name: 'South & Central Boroughs',
            cities: ['San Fernando Waterfront', 'Chaguanas Main Road', 'Montrose'],
          },
        ],
      },
    ],
  },
  {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    states: [
      {
        name: 'State of São Paulo',
        localGovts: [
          {
            name: 'São Paulo Municipality',
            cities: ['Jardins', 'Vila Madalena', 'Itaim Bibi', 'Pinheiros', 'Paulista Avenue'],
          },
        ],
      },
      {
        name: 'State of Rio de Janeiro',
        localGovts: [
          {
            name: 'Rio de Janeiro Municipality',
            cities: ['Ipanema', 'Leblon', 'Copacabana', 'Barra da Tijuca', 'Botafogo'],
          },
        ],
      },
    ],
  },
  {
    name: 'Malaysia',
    code: 'MY',
    dialCode: '+60',
    flag: '🇲🇾',
    currencyCode: 'MYR',
    states: [
      {
        name: 'Federal Territory of Kuala Lumpur',
        localGovts: [
          {
            name: 'Kuala Lumpur Metro',
            cities: ['KLCC & Bukit Bintang', 'Bangsar', 'Mont Kiara', 'Chinatown (Petaling St)'],
          },
        ],
      },
      {
        name: 'Selangor',
        localGovts: [
          {
            name: 'Petaling District',
            cities: ['Petaling Jaya', 'Subang Jaya', 'Damansara Utama', 'Sunway'],
          },
        ],
      },
    ],
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
    flag: '🇸🇬',
    currencyCode: 'SGD',
    states: [
      {
        name: 'Central Region',
        localGovts: [
          {
            name: 'Downtown Core & Orchard',
            cities: ['Orchard Road', 'Marina Bay', 'Tanjong Pagar', 'Chinatown', 'Bugis'],
          },
        ],
      },
      {
        name: 'East & West Regions',
        localGovts: [
          {
            name: 'Regional Hubs',
            cities: ['Katong & East Coast', 'Jurong East Gateway', 'Buona Vista'],
          },
        ],
      },
    ],
  },
  {
    name: 'Egypt',
    code: 'EG',
    dialCode: '+20',
    flag: '🇪🇬',
    currencyCode: 'EGP',
    states: [
      {
        name: 'Cairo Governorate',
        localGovts: [
          {
            name: 'Greater Cairo Municipalities',
            cities: ['Zamalek', 'New Cairo (Fifth Settlement)', 'Maadi', 'Heliopolis', 'Downtown Cairo'],
          },
        ],
      },
      {
        name: 'Giza Governorate',
        localGovts: [
          {
            name: 'Giza & Sheikh Zayed',
            cities: ['Sheikh Zayed City', '6th of October City', 'Mohandessin', 'Dokki'],
          },
        ],
      },
    ],
  },
  {
    name: 'Morocco',
    code: 'MA',
    dialCode: '+212',
    flag: '🇲🇦',
    currencyCode: 'MAD',
    states: [
      {
        name: 'Casablanca-Settat',
        localGovts: [
          {
            name: 'Casablanca Prefecture',
            cities: ['Anfa & Gauthier', 'Maârif', 'Corniche Ain Diab', 'Casablanca Finance City'],
          },
        ],
      },
      {
        name: 'Marrakesh-Safi',
        localGovts: [
          {
            name: 'Marrakesh Prefecture',
            cities: ['Guéliz', 'Hivernage', 'Medina & Jemaa el-Fna', 'Palmeraie'],
          },
        ],
      },
    ],
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialCode: '+251',
    flag: '🇪🇹',
    currencyCode: 'ETB',
    states: [
      {
        name: 'Addis Ababa City Administration',
        localGovts: [
          {
            name: 'Addis Ababa Sub-Cities',
            cities: ['Bole (Airport & Medhanealem)', 'Kirkos (Meskel Square)', 'Piazza & Arada', 'Kazanchis'],
          },
        ],
      },
    ],
  },
  {
    name: 'Other Worldwide Country',
    code: 'OTHER',
    dialCode: '+',
    flag: '🌐',
    currencyCode: 'USD',
    states: [
      {
        name: 'International / Other Territory',
        localGovts: [
          {
            name: 'General Region / District',
            cities: ['Metropolitan Capital', 'City Centre', 'Downtown District'],
          },
        ],
      },
    ],
  },
];
