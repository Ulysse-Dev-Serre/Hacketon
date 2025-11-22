import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import api from '../../api/axios';

const TeamCreate = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    tournamentId: '',
    maxMembers: 15,
    description: '',
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get('/tournaments/mine/');
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setTournaments([
          { id: 1, name: 'Summer Cup 2025' },
          { id: 2, name: 'Winter League' }
        ]);
      }
    };
    fetchTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams/', {
        name: formData.name,
        tournament_id: formData.tournamentId,
        max_capacity: parseInt(formData.maxMembers),
        description: formData.description
      });
      navigate('/organizer/dashboard');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Erreur lors de la création');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 min-h-screen bg-[#CFCFCF]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Créer une équipe</h1>
        <p className="text-[#737572]">Ajoutez une équipe à l’un de vos tournois</p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white border border-[#D0D0D0] rounded-xl p-8 space-y-6 shadow-sm"
      >

        {/* Nom équipe */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">
            Nom de l'équipe
          </label>
          <input
            type="text"
            required
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:outline-none focus:border-[#2A800A]"
            placeholder="Ex: Les Tigres de Lyon"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Tournoi */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">
            Tournoi Parent
          </label>
          <select
            required
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:outline-none focus:border-[#2A800A]"
            value={formData.tournamentId}
            onChange={(e) => setFormData({...formData, tournamentId: e.target.value})}
          >
            <option value="">Sélectionner un tournoi</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Capacité */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">
            Capacité Maximale (Joueurs)
          </label>
          <input
            type="number"
            min="1"
            required
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:outline-none focus:border-[#2A800A]"
            value={formData.maxMembers}
            onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#737572] mb-2">
            Description (Optionnel)
          </label>
          <textarea
            rows="4"
            className="w-full bg-white border border-[#D0D0D0] rounded-lg px-4 py-2 text-[#2A800A] focus:outline-none focus:border-[#2A800A]"
            placeholder="Présentez votre équipe..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#D0D0D0]">
          <button
            type="button"
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-2 px-6 py-2 border border-[#D0D0D0] rounded-lg text-[#737572] hover:bg-[#EDEDED] transition"
          >
            <X className="h-5 w-5" /> Annuler
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-[#2A800A] hover:bg-[#256E08] text-white rounded-lg transition"
          >
            <Save className="h-5 w-5" /> Créer l'équipe
          </button>
        </div>

      </form>
    </div>
  );
};

export default TeamCreate;

