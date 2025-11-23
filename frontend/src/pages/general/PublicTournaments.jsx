import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Trophy, Calendar, Users } from 'lucide-react';
import useApi from '../../api/axios';

const PublicTournaments = () => {
  const api = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    city: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search); // Note: Backend search filter might need implementation if not exists, but we can filter client side or use existing filters
        if (filters.sport) params.append('sport', filters.sport);
        if (filters.city) params.append('city', filters.city);

        const res = await api.get(`/tournaments/?${params.toString()}`);
        let data = res.data;

        // Client-side search filtering if backend doesn't support 'search' query param fully or for broader match
        if (filters.search) {
            const lowerSearch = filters.search.toLowerCase();
            data = data.filter(t => 
                t.name.toLowerCase().includes(lowerSearch) || 
                t.city.toLowerCase().includes(lowerSearch) ||
                t.sport.toLowerCase().includes(lowerSearch)
            );
        }

        setTournaments(data);
      } catch (error) {
        console.error('Erreur chargement tournois:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchTournaments(), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-[#2A800A] mb-2">Tous les Tournois</h1>
            <p className="text-[#737572] text-lg">Découvrez les compétitions à venir et trouvez votre prochain défi.</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E0E0E0] mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Rechercher un tournoi, une ville..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full pl-10 pr-4 py-2 border border-[#D0D0D0] rounded-lg focus:outline-none focus:border-[#2A800A] focus:ring-1 focus:ring-[#2A800A]"
                    />
                </div>

                {/* Toggle Filters (Mobile) */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                >
                    <Filter className="h-5 w-5" /> Filtres
                </button>

                {/* Desktop Filters (always visible) & Mobile Filters (conditional) */}
                <div className={`flex-col md:flex-row gap-4 w-full md:w-auto ${showFilters ? 'flex' : 'hidden md:flex'}`}>
                    
                    <select
                        name="sport"
                        value={filters.sport}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border border-[#D0D0D0] rounded-lg focus:border-[#2A800A] bg-white"
                    >
                        <option value="">Tous les sports</option>
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Volleyball">Volleyball</option>
                    </select>

                    <input
                        type="text"
                        name="city"
                        placeholder="Ville..."
                        value={filters.city}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border border-[#D0D0D0] rounded-lg focus:border-[#2A800A]"
                    />
                </div>
            </div>
        </div>

        {/* Tournaments Grid */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Chargement des tournois...</div>
        ) : tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map(tournament => (
                    <div key={tournament.id} className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] overflow-hidden hover:shadow-md transition group flex flex-col">
                        <div className="h-3 bg-[#2A800A]"></div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-green-50 text-[#2A800A] p-2 rounded-lg group-hover:bg-[#2A800A] group-hover:text-white transition duration-300">
                                    <Trophy className="h-8 w-8" />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
                                    {tournament.sport}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1" title={tournament.name}>
                                {tournament.name}
                            </h3>
                            
                            <div className="space-y-3 mb-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#2A800A]" />
                                    {tournament.city}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[#2A800A]" />
                                    {new Date(tournament.start_date).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                                {/* Si on avait accès au nombre d'équipes directement ici, on l'afficherait */}
                                {/* <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-[#2A800A]" />
                                    8 Équipes inscrites
                                </div> */}
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <Link 
                                    to={`/tournaments/${tournament.id}`}
                                    className="block w-full py-2 text-center font-semibold text-[#2A800A] hover:bg-green-50 rounded-lg transition"
                                >
                                    Voir les détails
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucun tournoi trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default PublicTournaments;
