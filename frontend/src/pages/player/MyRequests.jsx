import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/my-requests/'); // 🔥 ton endpoint Django
        setRequests(response.data);
      } catch (error) {
        console.error('Erreur chargement requêtes :', error);
        setRequests([]); // aucune donnée → pas de statique
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6 bg-[#CFCFCF] min-h-screen px-4">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Mes Requêtes</h1>
        <p className="text-[#737572]">Suivez l'état de vos demandes d'adhésion</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-[#737572]">
          Chargement des requêtes...
        </div>
      )}

      {/* Requests List */}
      {!loading && (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm"
            >
              {/* Team Information */}
              <div>
                <h3 className="text-lg font-bold text-[#2A800A]">{request.team.name}</h3>
                <p className="text-[#737572] text-sm">
                  Demande envoyée le {request.created_at}
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium
                  ${
                    request.status === "pending"
                      ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                      : request.status === "accepted"
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "bg-red-100 border-red-300 text-red-700"
                  }
                `}
              >
                {request.status === "pending" && <Clock className="h-4 w-4" />}
                {request.status === "accepted" && <CheckCircle className="h-4 w-4" />}
                {request.status === "rejected" && <XCircle className="h-4 w-4" />}

                <span>
                  {request.status === "pending"
                    ? "En attente"
                    : request.status === "accepted"
                    ? "Acceptée"
                    : "Refusée"}
                </span>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-12 text-[#737572]">
              Aucune requête trouvée.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRequests;


