const countryCodeToFlagPath = (countryCode: string): string => {
    
    if (!countryCode) {
      return '/flags/eu.svg';
    }
  
    if (countryCode.trim() === '') {
      return '/flags/eu.svg';
    }
  
    const countryMapping: { [key: string]: string } = {
      'ITA': 'italy',
      'ESP': 'spain', 
      'IRL': 'ireland',
      'NOR': 'norway',
      'FRA': 'france',
      'DEU': 'germany',
      'NLD': 'netherlands',
      'BEL': 'belgium',
      'POL': 'poland',
      'PRT': 'portugal',
      'ROU': 'romania',
      'AUT': 'austria',
      'SWE': 'sweden',
      'FIN': 'finland',
      'DNK': 'denmark',
      'CZE': 'czech-republic',
      'GRC': 'greece',
      'BGR': 'bulgaria',
      'HRV': 'croatia',
      'SVK': 'slovakia',
      'LTU': 'lithuania',
      'LVA': 'latvia',
      'EST': 'estonia',
      'CYP': 'cyprus',
      'HUN': 'hungary',
      'SVN': 'slovenia',
      'LUX': 'luxembourg',
      'MLT': 'malta'
    };
  
    const code = countryCode.toUpperCase().trim();
    const mappedCountry = countryMapping[code];
    
    if (!mappedCountry) {
      return '/flags/eu.svg';
    }
    
    const flagPath = `/flags/${mappedCountry}.svg`;
    return flagPath;
  };

  export { countryCodeToFlagPath };