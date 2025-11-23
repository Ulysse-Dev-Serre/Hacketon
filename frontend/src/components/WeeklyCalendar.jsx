import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import useApi from '../api/axios';

const WeeklyCalendar = () => {
  const api = useApi();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches/');
        // On garde les matchs à venir ou d'aujourd'hui
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const validMatches = res.data.filter(m => new Date(m.date) >= now);
        setMatches(validMatches);
      } catch (error) {
        console.error("Erreur chargement calendrier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Générer les 7 prochains jours
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  if (loading) return <div className="text-center py-8 text-gray-500">Chargement du calendrier...</div>;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {days.map((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayMatches = matches.filter(m => m.date.startsWith(dateStr)).sort((a, b) => new Date(a.date) - new Date(b.date));
        const isToday = index === 0;

        return (
          <div 
            key={dateStr} 
            className={`flex flex-col rounded-xl border overflow-hidden h-full min-h-[180px]
              ${isToday ? 'border-[#2A800A] shadow-md bg-white' : 'border-gray-200 bg-gray-50'}
            `}
          >
            {/* Header Date */}
            <div className={`p-2 text-center font-bold text-sm border-b
                ${isToday ? 'bg-[#2A800A] text-white' : 'bg-gray-100 text-gray-600'}
            `}>
              {formatDate(date)}
            </div>

            {/* Matches List */}
            <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto max-h-[250px] custom-scrollbar">
              {dayMatches.length > 0 ? (
                dayMatches.map(match => (
                  <div key={match.id} className="bg-white p-2 rounded border border-gray-100 shadow-sm text-xs hover:border-[#2A800A] transition">
                    <div className="font-bold text-gray-800 mb-1 text-center">
                        {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="truncate font-medium" title={match.team_a.name}>{match.team_a.name}</div>
                        <div className="text-[10px] text-gray-400 text-center">VS</div>
                        <div className="truncate font-medium" title={match.team_b.name}>{match.team_b.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                  Aucun match
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
