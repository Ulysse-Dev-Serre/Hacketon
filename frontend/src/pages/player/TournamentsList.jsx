import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Trophy } from 'lucide-react';
import useApi from '../../api/axios';

const TournamentsList = () => {
  const api = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    sport: ''
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city);
        if (filters.sport) params.append('sport', filters.sport);

        const res = await api.get(`/tournaments/?${params.toString()}`);
        setTournaments(res.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#CFCFCF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2A800A]">Trouver un Tournoi</h1>
            <p className="text-[#737572] mt-2">Rejoignez une ligue près de chez vous</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#F2F2F2] border border-[#D0D0D0] p-4 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-white border border-[#D0D0D0] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <MapPin className="h-5 w-5 text-[#737572]" />
            <input 
              placeholder="Ville..." 
              className="bg-transparent outline-none w-full text-[#4A4A4A]"
              value={filters.city}
              onChange={e => setFilters(prev => ({...prev, city: e.target.value}))}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-[#D0D0D0] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <Trophy className="h-5 w-5 text-[#737572]" />
            <select 
              className="bg-transparent outline-none w-full text-[#4A4A4A]"
              value={filters.sport}
              onChange={e => setFilters(prev => ({...prev, sport: e.target.value}))}
            >
              <option value="">Tous les sports</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-10 text-[#737572]">Chargement...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.length > 0 ? tournaments.map(tournament => (
              <Link 
                key={tournament.id} 
                to={`/tournaments/${tournament.id}`} // Note: We might need a public detail page, or reuse the organizer one with limited view
                className="group bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl overflow-hidden hover:shadow-md transition hover:border-[#2A800A]"
              >
                <div className="h-32 bg-gradient-to-r from-[#2A800A] to-green-600 p-6 flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-white opacity-80 group-hover:scale-110 transition" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2A800A] mb-2 group-hover:text-green-700">
                    {tournament.name}
                  </h3>
                  
                  <div className="space-y-2 text-[#737572] text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {tournament.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {tournament.start_date}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#D0D0D0] flex justify-between items-center">
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                      {tournament.sport}
                    </span>
                    <span className="text-sm font-semibold text-[#2A800A]">
                      Voir détails →
                    </span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12 bg-[#F2F2F2] rounded-xl border border-[#D0D0D0] text-[#737572]">
                Aucun tournoi trouvé pour ces critères.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsList;
