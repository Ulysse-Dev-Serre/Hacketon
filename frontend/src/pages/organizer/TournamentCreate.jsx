import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import useApi from '../../api/axios';

const TournamentCreate = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'football',
    city: '',
    startDate: '',
    endDate: '',
    maxTeams: 16,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await api.post('/tournaments/', {
        name: formData.name,
        sport: formData.sport,
        city: formData.city,
        start_date: formData.startDate, // Adjusting to API expectations if snake_case
        end_date: formData.endDate,
        max_teams: parseInt(formData.maxTeams),
        description: formData.description
      });
      
      navigate('/organizer/tournaments');
    } catch (err) {
      console.error('Failed to create tournament:', err);
      setError('Erreur lors de la création du tournoi. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Créer un tournoi</h1>
        <p className="text-slate-400">Configurez les détails de votre nouvelle ligue</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">Nom du tournoi</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ex: Ligue d'été 2025"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sport</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
            >
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="volleyball">Volleyball</option>
              <option value="esport">E-Sport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ville</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date de début</label>
            <input
              type="date"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date de fin</label>
            <input
              type="date"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre max d'équipes</label>
            <input
              type="number"
              required
              min="2"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              value={formData.maxTeams}
              onChange={(e) => setFormData({...formData, maxTeams: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            rows="4"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            placeholder="Règles, prix, informations importantes..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/organizer/tournaments')}
            className="flex items-center gap-2 px-6 py-2 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" /> Annuler
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Save className="h-5 w-5" /> {isLoading ? 'Création...' : 'Créer le tournoi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TournamentCreate;
