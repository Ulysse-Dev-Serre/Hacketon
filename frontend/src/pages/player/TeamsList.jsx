import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, MapPin } from 'lucide-react';
import useApi from '../../api/axios';

const TeamsList = () => {
  const api = useApi();
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    city: '',
    available_only: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.sport) params.append('sport', filters.sport);
        if (filters.city) params.append('city', filters.city);
        if (filters.available_only) params.append('available', 'true');

        const response = await api.get(`/teams/available/?${params.toString()}`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]); // on affiche juste aucune équipe
      }
    };

    const timeoutId = setTimeout(() => fetchTeams(), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6 py-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Trouver une équipe</h1>
        <p className="text-gray-600">Rejoignez une équipe locale et commencez la compétition</p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-4">
        
        {/* SEARCH BAR */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              name="search"
              placeholder="Rechercher une équipe..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-white border border-[#D0D0D0] rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A800A]"
            />
          </div>

          {/* FILTER BUTTON */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition 
              ${showFilters 
                ? 'bg-[#2A800A] border-[#2A800A] text-white'
                : 'bg-white border-[#D0D0D0] text-gray-700 hover:bg-gray-100'}
            `}
          >
            <Filter className="h-5 w-5" /> Filtres
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-[#D0D0D0] shadow-sm">

            {/* VILLE */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ville</label>
              <input
                type="text"
                name="city"
                placeholder="Ex: Paris"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700 focus:border-[#2A800A]"
              />
            </div>

            {/* SPORT */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sport</label>
              <select
                name="sport"
                value={filters.sport}
                onChange={handleFilterChange}
                className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700 focus:border-[#2A800A]"
              >
                <option value="">Tous</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Tennis">Tennis</option>
                <option value="Esport">Esport</option>
              </select>
            </div>

            {/* CHECKBOX */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="available_only"
                  checked={filters.available_only}
                  onChange={handleFilterChange}
                  className="w-4 h-4 border-[#D0D0D0] text-[#2A800A]"
                />
                Places disponibles uniquement
              </label>
            </div>
          </div>
        )}
      </div>

      {/* TEAMS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white border border-[#D0D0D0] rounded-xl p-6 shadow-sm hover:border-[#2A800A] transition"
          >

            {/* TOP */}
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-[#2A800A] text-white rounded-lg flex items-center justify-center font-bold text-lg">
                {team.name.substring(0, 2).toUpperCase()}
              </div>

              <span className="bg-[#2A800A]/10 text-[#2A800A] text-xs px-3 py-1 rounded-full font-medium">
                {team.sport}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#2A800A] mb-2">{team.name}</h3>

            <div className="space-y-2 text-gray-600 text-sm mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2A800A]" /> {team.city}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2A800A]" />
                {team.current_capacity} / {team.max_capacity} Joueurs
              </div>
            </div>

            <Link
              to={`/teams/${team.id}`}
              className="block w-full text-center py-2 border border-[#D0D0D0] rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Voir les détails
            </Link>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600">
            Aucune équipe trouvée correspondant à vos critères.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsList;

