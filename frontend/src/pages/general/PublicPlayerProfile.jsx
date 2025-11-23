import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Trophy, Activity } from 'lucide-react';
import useApi from '../../api/axios';

const PublicPlayerProfile = () => {
  const { id } = useParams(); // This is the User ID
  const api = useApi();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/players/${id}/`);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching player profile:", err);
        setError("Impossible de charger le profil. Le joueur n'existe peut-être pas.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#CFCFCF]">
        <div className="text-[#737572] text-xl">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#CFCFCF]">
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center">
            <div className="text-red-500 text-xl mb-4">Oups !</div>
            <p className="text-[#737572] mb-6">{error}</p>
            <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-[#2A800A] text-white rounded-lg hover:bg-[#256E08]"
            >
                Retour
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#CFCFCF] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0D0D0] overflow-hidden mb-6">
            <div className="bg-[#2A800A] h-32 relative">
                <div className="absolute -bottom-12 left-8">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                        <div className="h-full w-full rounded-full bg-[#F2F2F2] flex items-center justify-center text-4xl font-bold text-[#2A800A]">
                            {profile.full_name?.charAt(0).toUpperCase() || <User />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-16 pb-8 px-8">
                <h1 className="text-3xl font-bold text-[#2A800A] mb-1">{profile.full_name}</h1>
                <p className="text-[#737572] flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-sm border border-[#D0D0D0]">
                        Joueur
                    </span>
                </p>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Main Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D0D0D0] space-y-6">
                <h2 className="text-xl font-bold text-[#2A800A] border-b border-[#EAEAEA] pb-2">Informations</h2>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#F2F2F2] rounded-lg text-[#2A800A]">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-[#737572]">Ville</p>
                            <p className="font-medium text-[#4A4A4A]">{profile.city || "Non renseigné"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#F2F2F2] rounded-lg text-[#2A800A]">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-[#737572]">Sport Favori</p>
                            <p className="font-medium text-[#4A4A4A]">{profile.favorite_sport || "Non renseigné"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#F2F2F2] rounded-lg text-[#2A800A]">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-[#737572]">Niveau</p>
                            <p className="font-medium text-[#4A4A4A] capitalized">{profile.level || "Non renseigné"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Info / Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D0D0D0]">
                <h2 className="text-xl font-bold text-[#2A800A] border-b border-[#EAEAEA] pb-2 mb-4">Poste</h2>
                <div className="p-4 bg-[#F2F2F2] rounded-lg border border-[#D0D0D0] text-center">
                    <p className="text-lg font-medium text-[#4A4A4A]">
                        {profile.position || "Polyvalent"}
                    </p>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full py-2 border border-[#D0D0D0] rounded-lg text-[#737572] hover:bg-[#F2F2F2] transition"
                    >
                        Retour
                    </button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default PublicPlayerProfile;
