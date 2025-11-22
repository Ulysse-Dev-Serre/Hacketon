import React, { useEffect, useState } from 'react';
import { Check, X, User } from 'lucide-react';
import useApi from '../../api/axios';

const RequestsReceived = () => {
  const api = useApi();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/teams/requests/received/');
        setRequests(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des demandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Accept a request
  const handleAccept = async (id) => {
    try {
      await api.post(`/teams/requests/${id}/accept/`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Erreur acceptation :", error);
    }
  };

  // Reject a request
  const handleReject = async (id) => {
    try {
      await api.post(`/teams/requests/${id}/reject/`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Erreur refus :", error);
    }
  };

  if (loading)
    return <p className="text-[#737572] text-center py-6">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A800A]">Demandes Reçues</h1>
        <p className="text-[#737572]">Gérez les demandes d'adhésion à vos équipes</p>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center">
                <User className="h-6 w-6 text-[#737572]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#2A800A]">{request.playerName}</h3>
                <p className="text-[#737572] text-sm">
                  Veut rejoindre <span className="text-[#2A800A] font-medium">{request.teamName}</span>
                </p>
                <p className="text-[#737572] text-xs mt-1">
                  Poste : {request.role} • Reçu le {request.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleReject(request.id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                title="Refuser"
              >
                <X className="h-6 w-6" />
              </button>

              <button
                onClick={() => handleAccept(request.id)}
                className="p-2 rounded-full bg-green-100 text-[#2A800A] hover:bg-green-200 transition"
                title="Accepter"
              >
                <Check className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12 text-[#737572] bg-[#F2F2F2] border border-[#D0D0D0] rounded-xl">
            Aucune demande en attente.
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsReceived;
