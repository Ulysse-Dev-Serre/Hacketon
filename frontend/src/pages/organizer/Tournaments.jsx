import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import useApi from '../../api/axios';

const Tournaments = () => {
  const api = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/tournaments/mine/');
        setTournaments(res.data);
      } catch (error) {
        console.error("Erreur chargement tournois :", error);
        setTournaments([]); // pas de données → vide, NO STATIC
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="space-y-6 py-6 px-4 bg-[#CFCFCF] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2A800A]">Mes Tournois</h1>

        <Link 
          to="/organizer/tournaments/create"
          className="flex items-center gap-2 bg-[#2A800A] hover:bg-[#256E08] text-white px-4 py-2 rounded-lg"
        >
          <Plus className="h-5 w-5" /> Nouveau Tournoi
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-[#737572]">
          Chargement des tournois...
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/organizer/tournaments/${tournament.id}`}
                className="block bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 hover:bg-[#EAEAEA] transition"
              >
                {/* Status - Hardcoded for now as model doesn't have it */}
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs rounded-full border font-medium bg-green-100 text-green-700 border-green-300">
                    En cours
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#2A800A] mb-2">
                  {tournament.name}
                </h3>

                {/* Infos */}
                <p className="text-[#737572] text-sm">{tournament.city} - {tournament.sport}</p>
                <p className="text-[#737572] text-sm">Début : {tournament.start_date}</p>

                {/* Teams Progress - Simulated for now */}
                <div className="flex justify-between items-center mt-6 text-sm text-[#737572]">
                  <span>{tournament.teams_count || 0} Équipes</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-[#737572]">
              Aucun tournoi trouvé.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tournaments;


