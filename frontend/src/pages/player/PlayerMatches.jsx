import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import MatchesCalendar from '../../components/MatchesCalendar';

const PlayerMatches = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen bg-[#CFCFCF]">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-[#2A800A] flex items-center gap-3">
                <CalendarIcon className="h-8 w-8" /> Calendrier des Matchs
            </h1>
            <p className="text-[#737572] mt-1">Tous les matchs de la ligue. Vos matchs sont en <span className="text-[#2A800A] font-bold bg-white px-2 py-0.5 rounded border border-[#2A800A]">vert</span>.</p>
        </div>
      </div>

      <MatchesCalendar />

    </div>
  );
};

export default PlayerMatches;
