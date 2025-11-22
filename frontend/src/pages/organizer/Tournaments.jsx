import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../../api/axios';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await api.get('/organizer/tournaments/');
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
                {/* Status */}
                <div className="mb-4">
                  <span className={`px-3 py-1 text-xs rounded-full border font-medium
                    ${
                      tournament.status === "ongoing"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : tournament.status === "registration"
                        ? "bg-gray-200 text-gray-700 border-gray-300"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }
                  `}>
                    {tournament.status === "ongoing"
                      ? "En cours"
                      : tournament.status === "registration"
                      ? "Inscriptions"
                      : "Planifié"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#2A800A] mb-2">
                  {tournament.name}
                </h3>

                {/* Infos */}
                <p className="text-[#737572] text-sm">{tournament.location}</p>
                <p className="text-[#737572] text-sm">{tournament.dates}</p>

                {/* Teams Progress */}
                <div className="flex justify-between items-center mt-6 text-sm text-[#737572]">
                  <span>{tournament.teams} / {tournament.maxTeams} Équipes</span>

                  <div className="w-24 h-2 bg-[#D0D0D0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2A800A]"
                      style={{ width: `${(tournament.teams / tournament.maxTeams) * 100}%` }}
                    />
                  </div>
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


