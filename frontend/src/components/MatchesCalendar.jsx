import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import useApi from '../api/axios';

const MatchesCalendar = ({ compact = false }) => {
  const api = useApi();
  const [allMatches, setAllMatches] = useState([]);
  const [myMatchesIds, setMyMatchesIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allRes = await api.get('/matches/');
        const myRes = await api.get('/matches/my/');
        setAllMatches(allRes.data);
        setMyMatchesIds(new Set(myRes.data.map(m => m.id)));
      } catch (error) {
        console.error('Erreur chargement matchs :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`bg-gray-50/50 border border-[#E0E0E0] ${compact ? 'min-h-[60px]' : 'min-h-[100px]'}`}></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayMatches = allMatches.filter(m => m.date.startsWith(dateStr));

      days.push(
        <div key={day} className={`bg-white border border-[#E0E0E0] p-1 flex flex-col gap-1 transition hover:bg-gray-50 ${compact ? 'min-h-[80px]' : 'min-h-[120px] p-2'}`}>
          <div className={`text-right font-medium text-[#737572] ${compact ? 'text-xs' : 'text-sm mb-1'}`}>{day}</div>
          
          <div className="flex flex-col gap-1">
            {dayMatches.map(match => {
              const isMyMatch = myMatchesIds.has(match.id);
              if (compact) {
                  // Compact view: dots or mini bars
                  return (
                    <div 
                        key={match.id}
                        className={`h-1.5 w-full rounded-full ${isMyMatch ? 'bg-[#2A800A]' : 'bg-[#D0D0D0]'}`}
                        title={`${match.team_a?.name} vs ${match.team_b?.name}`}
                    />
                  )
              }

              return (
                <div 
                  key={match.id} 
                  className={`text-xs p-2 rounded-lg border shadow-sm transition cursor-pointer
                    ${isMyMatch 
                        ? 'bg-[#2A800A] text-white border-[#2A800A] hover:bg-[#256E08]' 
                        : 'bg-white text-[#4A4A4A] border-[#D0D0D0] hover:border-[#2A800A]'
                    }
                  `}
                  title={`${match.team_a?.name} vs ${match.team_b?.name}`}
                >
                  <div className="font-bold truncate mb-0.5">
                    {match.team_a?.name} vs {match.team_b?.name}
                  </div>
                  <div className={`flex justify-between items-center ${isMyMatch ? 'text-green-100' : 'text-[#737572]'}`}>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {match.score_a !== null ? (
                        <span className="font-mono font-bold">{match.score_a}-{match.score_b}</span>
                    ) : (
                        <span>-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  if (loading) return <div className="py-10 text-center text-[#737572]">Chargement...</div>;

  return (
    <div className="bg-white rounded-xl border border-[#D0D0D0] shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className={`flex justify-between items-center border-b border-[#E0E0E0] ${compact ? 'p-3' : 'p-4'}`}>
            <span className={`font-bold text-[#2A800A] ${compact ? 'text-base' : 'text-xl'}`}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-[#F2F2F2] rounded-lg text-[#737572]">
                    <ChevronLeft className={` ${compact ? 'h-4 w-4' : 'h-6 w-6'}`} />
                </button>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-[#F2F2F2] rounded-lg text-[#737572]">
                    <ChevronRight className={` ${compact ? 'h-4 w-4' : 'h-6 w-6'}`} />
                </button>
            </div>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-7 bg-[#F9F9F9] border-b border-[#E0E0E0] text-center py-2 font-bold text-[#737572] text-xs">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <div key={d}>{d}</div>)}
        </div>

        {/* Grid Body */}
        <div className="grid grid-cols-7 bg-[#E0E0E0] gap-px">
            {renderCalendarDays()}
        </div>
    </div>
  );
};

export default MatchesCalendar;
