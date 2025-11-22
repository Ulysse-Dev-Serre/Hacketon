import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit, Shield, Save, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useApi from '../../api/axios';

const Profile = () => {
  const api = useApi();
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    favorite_sport: 'Football',
    level: 'beginner',
    position: '',
    bio: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (isLoaded && user) {
        // 1. Sync User & Get DB Profile
        try {
           // First ensure user is synced (handled by auth middleware on this call)
           // And fetch existing profile data from Postgres
           const res = await api.get('/player/profile/');
           const dbProfile = res.data;

           // Merge DB data with Clerk data (DB takes precedence if set)
           setFormData(prev => ({
             ...prev,
             full_name: user.fullName || '',
             city: dbProfile.city || user.unsafeMetadata?.city || '',
             favorite_sport: dbProfile.favorite_sport || user.unsafeMetadata?.favorite_sport || 'Football',
             level: dbProfile.level || user.unsafeMetadata?.level || 'beginner',
             position: dbProfile.position || user.unsafeMetadata?.position || '',
             bio: user.unsafeMetadata?.bio || '',  // Bio is only in Clerk for now (model doesn't have it)
             phone: user.unsafeMetadata?.phone || '', // Phone only in Clerk
           }));
           
           // If no profile data yet, go to edit mode
           if (!dbProfile.city) {
             setIsEditing(true);
           }

        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    fetchProfile();
  }, [isLoaded, user]);

  const levelOptions = [
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
  ];

  const stats = { matches: 42, wins: 28, goals: 15 };

  const handleSave = async () => {
    if (!formData.full_name || !formData.city || !formData.favorite_sport || !formData.level) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Update Clerk (Metadata)
      await user.update({
        firstName: formData.full_name.split(' ')[0],
        lastName: formData.full_name.split(' ').slice(1).join(' '),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          city: formData.city,
          phone: formData.phone,
          bio: formData.bio,
          favorite_sport: formData.favorite_sport,
          level: formData.level,
          position: formData.position,
        }
      });

      // 2. Update Backend (Postgres)
      await api.patch('/player/profile/', {
        city: formData.city,
        favorite_sport: formData.favorite_sport,
        level: formData.level,
        position: formData.position
      });

      setIsEditing(false);
    } catch (e) {
      console.error("Erreur:", e);
      alert("Erreur lors de la sauvegarde du profil.");
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isLoaded) return <div className="text-center py-10 text-[#2A800A]">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Carte principale */}
      <div className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl overflow-hidden shadow-md">

        {/* Header */}
        <div className="h-32 bg-[#2A800A]"></div>

        <div className="px-8 pb-8 mt-12">
          {/* Bande supérieure */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#F2F2F2] flex items-center justify-center overflow-hidden shadow">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-[#2A800A]" />
                )}
              </div>

              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-[#2A800A]">{formData.full_name}</h1>
                <p className="text-gray-600">{formData.position || 'Joueur'}</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D0D0D0] rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <Edit className="h-4 w-4" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D0D0D0] rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <X className="h-4 w-4" /> Annuler
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2A800A] text-white rounded-lg hover:bg-[#256E08] transition"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" /> {isLoading ? '...' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* Colonne Informations */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2A800A] mb-4">Informations</h3>

                {isEditing ? (
                  <div className="space-y-4">

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Ville *</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        disabled
                        value={user?.primaryEmailAddress?.emailAddress}
                        className="w-full bg-gray-100 border border-[#D0D0D0] rounded px-3 py-2 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#2A800A]" />
                      <span>{formData.city || 'Non renseigné'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#2A800A]" />
                      <span>{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#2A800A]" />
                      <span>{formData.phone || 'Non renseigné'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne Profil sportif */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-[#2A800A] mb-4">Profil Sportif</h3>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nom complet *</label>
                      <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Sport *</label>
                      <select
                        name="favorite_sport"
                        value={formData.favorite_sport}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      >
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Esport">Esport</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Niveau *</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      >
                        {levelOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Poste</label>
                      <input
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-white border border-[#D0D0D0] rounded px-3 py-2 text-gray-700"
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="bg-white p-3 rounded border border-[#D0D0D0]">
                        <span className="text-gray-500 text-xs uppercase">Sport</span>
                        <div className="text-[#2A800A] font-semibold">{formData.favorite_sport}</div>
                      </div>

                      <div className="bg-white p-3 rounded border border-[#D0D0D0]">
                        <span className="text-gray-500 text-xs uppercase">Niveau</span>
                        <div className="text-[#2A800A] font-semibold">
                          {levelOptions.find(l => l.value === formData.level)?.label}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Bio</h4>
                      <p className="text-gray-700">
                        {formData.bio || "Aucune bio renseignée."}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Statistiques */}
              {!isEditing && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2A800A] mb-4">Statistiques</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#D0D0D0] text-center">
                      <div className="text-3xl font-bold text-[#2A800A]">{stats.matches}</div>
                      <div className="text-xs text-gray-600 uppercase">Matchs</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#D0D0D0] text-center">
                      <div className="text-3xl font-bold text-[#2A800A]">{stats.wins}</div>
                      <div className="text-xs text-gray-600 uppercase">Victoires</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#D0D0D0] text-center">
                      <div className="text-3xl font-bold text-[#2A800A]">{stats.goals}</div>
                      <div className="text-xs text-gray-600 uppercase">Buts</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
