import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const TransferRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:8080/shifts/transfer-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Fejl ved hentning af bytteanmodninger');
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
        alert('Kunne ikke hente bytteanmodninger');
      }
    };

    fetchRequests();
  }, [token]);

  const handleAction = async (id, action) => {
    // action: 'approve' eller 'reject'
    const endpoint = action === 'approve' ? 'approve-transfer' : 'reject-transfer';

    try {
      const res = await fetch(`http://localhost:8080/shifts/${endpoint}?shiftId=${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Fejl ved opdatering af anmodning');

      const text = await res.text();
      alert(text);

      // Opdater listen ved at fjerne den godkendte/afviste vagt
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert('Noget gik galt');
    }
  };

  return (
    <div className="p-6 relative min-h-screen">
              {/* Tilbage knap venstre hjørne */}
      <button
        onClick={() => navigate('/admin')}
        className="left-6 top-6 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Tilbage
      </button>
      <h1 className="text-2xl font-bold mb-6">Bytteanmodninger</h1>

      {requests.length === 0 ? (
        <p>Ingen bytteanmodninger.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <p><strong>Fra bruger:</strong> {req.assignedTo?.username || 'Ukendt'}</p>
                <p><strong>Til bruger:</strong> {req.requestedTransferTo?.username || 'Ukendt'}</p>
                <p><strong>Vagt ID:</strong> {req.id}</p>
                <p><strong>Start:</strong> {req.startTime}</p>
                <p><strong>Slut:</strong> {req.endTime}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAction(req.id, 'approve')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Bekræft
                </button>
                <button
                  onClick={() => handleAction(req.id, 'reject')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Afvis
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransferRequests;
