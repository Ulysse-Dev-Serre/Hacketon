import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import useApi from '../../api/axios';

const MatchCreate = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  
  const [formData, setFormData] = useState({
    tournamentId: '',
    team_a: '',
    team_b: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get('/tournaments/mine/');
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
        if (formData.tournamentId) {
            try {
                // We need to fetch teams for this specific tournament.
                // Assuming there is an endpoint or we can filter /teams/mine/
                // Since /teams/mine/ returns all teams for the organizer, we can filter client-side
                // OR better, fetch specific tournament details which includes teams.
                const response = await api.get(`/tournaments/${formData.tournamentId}/`);
                setTeams(response.data.teams || []);
            } catch (error) {
                console.error('Error fetching teams:', error);
                setTeams([]);
            }
        } else {
            setTeams([]);
        }
    };
    fetchTeams();
  }, [formData.tournamentId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    try {
      await api.post('/matches/', {
        team_a_id: formData.team_a,
        team_b_id: formData.team_b,
        date: dateTime.toISOString(),
        location: formData.location
      });

      navigate('/organizer/matches');
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Erreur lors de la création du match');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Créer un match</h1>
        <p className="text-[#737572]">Planifiez une rencontre entre deux équipes</p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-8 space-y-6 shadow-sm"
      >

        {/* Tournament */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">Tournoi</label>
          <select
            required
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:outline-none focus:border-[#2A800A]"
            value={formData.tournamentId}
            onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
          >
            <option value="">Sélectionner un tournoi</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#737572] mb-2">Équipe A (Domicile)</label>
            <select
              required
              className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:border-[#2A800A]"
              value={formData.team_a}
              onChange={(e) => setFormData({ ...formData, team_a: e.target.value })}
              disabled={!formData.tournamentId}
            >
              <option value="">Sélectionner</option>
              {teams
                .filter(t => t.id !== formData.team_b)
                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#737572] mb-2">Équipe B (Extérieur)</label>
            <select
              required
              className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:border-[#2A800A]"
              value={formData.team_b}
              onChange={(e) => setFormData({ ...formData, team_b: e.target.value })}
              disabled={!formData.tournamentId}
            >
              <option value="">Sélectionner</option>
              {teams
                .filter(t => t.id !== formData.team_a)
                .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
              }
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">Lieu</label>
          <input
            type="text"
            required
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:border-[#2A800A]"
            placeholder="Stade, Ville..."
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#737572] mb-2">Date</label>
            <input
              type="date"
              required
              className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:border-[#2A800A]"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#737572] mb-2">Heure</label>
            <input
              type="time"
              required
              className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:border-[#2A800A]"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#D0D0D0]">
          <button
            type="button"
            onClick={() => navigate('/organizer/matches')}
            className="flex items-center gap-2 px-6 py-2 border border-[#D0D0D0] rounded-lg text-[#737572] hover:bg-[#E5E5E5] transition"
          >
            <X className="h-5 w-5" /> Annuler
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#2A800A] hover:bg-[#256E08] text-white rounded-lg transition shadow-sm"
          >
            <Save className="h-5 w-5" /> Planifier
          </button>
        </div>

      </form>
    </div>
  );
};

export default MatchCreate;

