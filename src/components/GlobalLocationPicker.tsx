import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Building, ChevronDown, Check, Search, PlusCircle } from 'lucide-react';
import { WORLD_COUNTRIES, CountryInfo, StateProvinceInfo, LocalGovtInfo } from '../data/worldLocations';

export interface LocationSelection {
  country: string;
  countryCode: string;
  dialCode: string;
  flag: string;
  state: string;
  localGovt: string;
  city: string;
  formattedString: string;
}

interface GlobalLocationPickerProps {
  initialCountry?: string;
  initialState?: string;
  initialLocalGovt?: string;
  initialCity?: string;
  onChange: (location: LocationSelection) => void;
  onCountryDialCodeChange?: (dialCode: string) => void;
}

export const GlobalLocationPicker: React.FC<GlobalLocationPickerProps> = ({
  initialCountry = 'Nigeria',
  initialState = 'Lagos',
  initialLocalGovt = 'Eti-Osa',
  initialCity = 'Victoria Island',
  onChange,
  onCountryDialCodeChange,
}) => {
  const [selectedCountryName, setSelectedCountryName] = useState<string>(initialCountry);
  const [selectedStateName, setSelectedStateName] = useState<string>(initialState);
  const [selectedLgaName, setSelectedLgaName] = useState<string>(initialLocalGovt);
  const [selectedCityName, setSelectedCityName] = useState<string>(initialCity);

  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomLga, setIsCustomLga] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  // Active country object
  const currentCountry =
    WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === selectedCountryName.toLowerCase()) ||
    WORLD_COUNTRIES[0];

  // Active state object
  const currentState =
    currentCountry.states.find((s) => s.name.toLowerCase() === selectedStateName.toLowerCase()) ||
    currentCountry.states[0] ||
    null;

  // Active LGA object
  const currentLga =
    currentState?.localGovts.find((l) => l.name.toLowerCase() === selectedLgaName.toLowerCase()) ||
    currentState?.localGovts[0] ||
    null;

  // Sync upwards when state changes
  useEffect(() => {
    const formatted = [
      selectedCityName,
      selectedLgaName ? `${selectedLgaName} District/LGA` : '',
      selectedStateName,
      currentCountry.name,
    ]
      .filter(Boolean)
      .join(', ');

    onChange({
      country: currentCountry.name,
      countryCode: currentCountry.code,
      dialCode: currentCountry.dialCode,
      flag: currentCountry.flag,
      state: selectedStateName,
      localGovt: selectedLgaName,
      city: selectedCityName,
      formattedString: formatted,
    });

    if (onCountryDialCodeChange) {
      onCountryDialCodeChange(currentCountry.dialCode);
    }
  }, [selectedCountryName, selectedStateName, selectedLgaName, selectedCityName]);

  const handleCountrySelect = (cName: string) => {
    setSelectedCountryName(cName);
    setIsCustomState(false);
    setIsCustomLga(false);
    setIsCustomCity(false);

    const newCountry = WORLD_COUNTRIES.find((c) => c.name === cName) || WORLD_COUNTRIES[0];
    const defaultState = newCountry.states[0]?.name || '';
    setSelectedStateName(defaultState);

    const defaultLga = newCountry.states[0]?.localGovts[0]?.name || '';
    setSelectedLgaName(defaultLga);

    const defaultCity = newCountry.states[0]?.localGovts[0]?.cities?.[0] || '';
    setSelectedCityName(defaultCity);
  };

  const handleStateSelect = (sName: string) => {
    if (sName === '__CUSTOM__') {
      setIsCustomState(true);
      setSelectedStateName('');
      setIsCustomLga(true);
      setSelectedLgaName('');
      setIsCustomCity(true);
      setSelectedCityName('');
      return;
    }
    setIsCustomState(false);
    setSelectedStateName(sName);

    const stateObj = currentCountry.states.find((s) => s.name === sName);
    if (stateObj) {
      const firstLga = stateObj.localGovts[0]?.name || '';
      setSelectedLgaName(firstLga);
      setIsCustomLga(false);

      const firstCity = stateObj.localGovts[0]?.cities?.[0] || '';
      setSelectedCityName(firstCity);
      setIsCustomCity(false);
    }
  };

  const handleLgaSelect = (lName: string) => {
    if (lName === '__CUSTOM__') {
      setIsCustomLga(true);
      setSelectedLgaName('');
      setIsCustomCity(true);
      setSelectedCityName('');
      return;
    }
    setIsCustomLga(false);
    setSelectedLgaName(lName);

    const lgaObj = currentState?.localGovts.find((l) => l.name === lName);
    if (lgaObj && lgaObj.cities && lgaObj.cities.length > 0) {
      setSelectedCityName(lgaObj.cities[0]);
      setIsCustomCity(false);
    }
  };

  const handleCitySelect = (cName: string) => {
    if (cName === '__CUSTOM__') {
      setIsCustomCity(true);
      setSelectedCityName('');
      return;
    }
    setIsCustomCity(false);
    setSelectedCityName(cName);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50/90 border border-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Restaurant Location (Worldwide Coverage)</span>
        </label>
        <span className="text-[10px] text-slate-600 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
          {currentCountry.flag} {currentCountry.name} ({currentCountry.dialCode})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. Country Scroll List */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Country *
          </label>
          <div className="relative">
            <select
              value={selectedCountryName}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 shadow-2xs appearance-none cursor-pointer pr-8"
            >
              {WORLD_COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* 2. State / Province Scroll List */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-700">
              State / Province *
            </label>
            {!isCustomState && (
              <button
                type="button"
                onClick={() => setIsCustomState(true)}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-bold"
              >
                + Type Other
              </button>
            )}
          </div>
          {isCustomState ? (
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Type your State/Province"
                value={selectedStateName}
                onChange={(e) => setSelectedStateName(e.target.value)}
                className="w-full bg-white border border-amber-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setIsCustomState(false)}
                className="absolute right-2 top-2 text-[10px] font-bold text-slate-500 hover:text-slate-800"
              >
                List
              </button>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedStateName}
                onChange={(e) => handleStateSelect(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 shadow-2xs appearance-none cursor-pointer pr-8"
              >
                {currentCountry.states.map((st) => (
                  <option key={st.name} value={st.name}>
                    {st.name} {st.code ? `(${st.code})` : ''}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Other / Not in list...</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          )}
        </div>

        {/* 3. Local Govt / County / District Scroll List */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-700">
              Local Govt / County *
            </label>
            {!isCustomLga && (
              <button
                type="button"
                onClick={() => setIsCustomLga(true)}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-bold"
              >
                + Type Other
              </button>
            )}
          </div>
          {isCustomLga || !currentState?.localGovts || currentState.localGovts.length === 0 ? (
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Type LGA / County / District"
                value={selectedLgaName}
                onChange={(e) => setSelectedLgaName(e.target.value)}
                className="w-full bg-white border border-amber-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
              />
              {currentState?.localGovts && currentState.localGovts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCustomLga(false)}
                  className="absolute right-2 top-2 text-[10px] font-bold text-slate-500 hover:text-slate-800"
                >
                  List
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedLgaName}
                onChange={(e) => handleLgaSelect(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 shadow-2xs appearance-none cursor-pointer pr-8"
              >
                {currentState.localGovts.map((lg) => (
                  <option key={lg.name} value={lg.name}>
                    {lg.name}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Other LGA / District...</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          )}
        </div>

        {/* 4. City / Town / Neighborhood Scroll List */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-slate-700">
              City / Town / Area *
            </label>
            {!isCustomCity && (
              <button
                type="button"
                onClick={() => setIsCustomCity(true)}
                className="text-[10px] text-amber-700 hover:text-amber-900 font-bold"
              >
                + Type Other
              </button>
            )}
          </div>
          {isCustomCity || !currentLga?.cities || currentLga.cities.length === 0 ? (
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Type City / Town / Area"
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
                className="w-full bg-white border border-amber-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
              />
              {currentLga?.cities && currentLga.cities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCustomCity(false)}
                  className="absolute right-2 top-2 text-[10px] font-bold text-slate-500 hover:text-slate-800"
                >
                  List
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedCityName}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20 shadow-2xs appearance-none cursor-pointer pr-8"
              >
                {currentLga.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="__CUSTOM__">+ Other City / Area...</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Selected Location Summary Preview */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 pt-1">
        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate">
          <strong>Selected Location:</strong>{' '}
          {[selectedCityName, selectedLgaName, selectedStateName, currentCountry.name]
            .filter(Boolean)
            .join(' • ')}
        </span>
      </div>
    </div>
  );
};
