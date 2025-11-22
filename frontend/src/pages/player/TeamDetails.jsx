import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Trophy, UserPlus, Edit, Trash2, Save, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import api from '../../api/axios';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Check if current user is the organizer of the team (simplified check)
  // Ideally, the backend should tell us permissions, or we check team.tournament.organizer_id
  const isOrganizer = user?.unsafeMetadata?.role === 'organizer'; 

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await api.get(`/teams/${id}/`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
        // Mock data
        setTeam({
            id: id,
            name: 'Paris United',
            description: 'Équipe amateur de haut niveau cherchant à monter en division régionale. Ambiance sérieuse mais conviviale.',
            city: 'Paris, France',
            sport: 'Football',
            level: 'Amateur Compétitif', // Note: Add 'level' to backend model if needed, or derive
            tournament: { name: 'Summer Cup 2025' },
            members: [
              { id: 1, full_name: 'Jean Dupont', role: 'Capitaine' }, // role mock
              { id: 2, full_name: 'Marc Martin', role: 'Joueur' },
              { id: 3, full_name: 'Paul Durand', role: 'Joueur' },
            ],
            current_capacity: 12,
            max_capacity: 15,
            stats: { matches: 12, wins: 8, losses: 4 } // Mock stats
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  const handleJoinRequest = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
        await api.post('/join-requests/', {
            team_id: id,
            message: joinMessage
        });
        alert('Demande envoyée avec succès !');
        setShowJoinModal(false);
    } catch (error) {
        console.error('Error sending join request:', error);
        alert('Erreur lors de l\'envoi de la demande. Vous avez peut-être déjà une demande en cours.');
    } finally {
        setIsSending(false);
    }
  };

  const handleDelete = async () => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.')) {
          try {
              await api.delete(`/teams/${id}/`);
              navigate('/organizer/dashboard');
          } catch (error) {
              console.error('Error deleting team:', error);
              alert('Erreur lors de la suppression. Vérifiez qu\'aucun joueur n\'est inscrit.');
          }
      }
  };

  if (isLoading) return <div className="text-white text-center py-10">Chargement...</div>;
  if (!team) return <div className="text-white text-center py-10">Équipe introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 relative">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/20">
              {team.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {team.city}</span>
                <span className="flex items-center gap-1"><Trophy className="h-4 w-4" /> {team.tournament?.name}</span>
                <span className="flex items-center gap-1 text-indigo-400 font-medium">
                    <Users className="h-4 w-4" /> {team.current_capacity} / {team.max_capacity} Places
                </span>
              </div>
            </div>
          </div>
          
          {isOrganizer ? (
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                      <Edit className="h-4 w-4" /> Modifier
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                  >
                      <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
              </div>
          ) : (
            <button 
                onClick={() => setShowJoinModal(true)}
                disabled={team.current_capacity >= team.max_capacity}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg ${
                    team.current_capacity >= team.max_capacity 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                }`}
            >
                <UserPlus className="h-5 w-5" /> {team.current_capacity >= team.max_capacity ? 'Complet' : 'Rejoindre'}
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">À propos</h2>
            <p className="text-slate-400 leading-relaxed">{team.description || "Aucune description disponible."}</p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Effectif ({team.members.length})</h2>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                      {member.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{member.full_name}</p>
                      {/* Role display can be added if backend provides it */}
                    </div>
                  </div>
                </div>
              ))}
              {team.members.length === 0 && <p className="text-slate-500 italic">Aucun joueur pour le moment.</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Matchs joués</span>
                <span className="text-white font-bold">{team.stats?.matches || 0}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Victoires</span>
                <span className="text-green-400 font-bold">{team.stats?.wins || 0}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: `${team.stats?.matches ? (team.stats.wins / team.stats.matches) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      {showJoinModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold text-white mb-4">Rejoindre {team.name}</h2>
                  <form onSubmit={handleJoinRequest}>
                      <div className="mb-4">
                          <label className="block text-sm text-slate-400 mb-2">Message pour l'organisateur (Optionnel)</label>
                          <textarea 
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-32"
                              placeholder="Présentez-vous brièvement..."
                              value={joinMessage}
                              onChange={(e) => setJoinMessage(e.target.value)}
                          ></textarea>
                      </div>
                      <div className="flex justify-end gap-3">
                          <button 
                              type="button"
                              onClick={() => setShowJoinModal(false)}
                              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                          >
                              Annuler
                          </button>
                          <button 
                              type="submit"
                              disabled={isSending}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                              {isSending ? 'Envoi...' : 'Envoyer la demande'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeamDetails;
