import { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

const MyShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/shifts/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Fejl ved hentning af vagter');
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        console.error("Fejl ved hentning af vagter", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/shifts/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Fejl ved hentning af brugere');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Fejl ved hentning af brugere", error);
      }
    };

    fetchShifts();
    fetchUsers();
  }, [username, token]);

  const openModal = (shift) => {
    setSelectedShift(shift);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedShift(null);
    setSelectedUser('');
    setShowModal(false);
  };

  const handleRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/shifts/request-transfer?shiftId=${selectedShift.id}&fromUsername=${username}&toUsername=${selectedUser}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const message = await response.text();
      alert(message);
      closeModal();
    } catch (error) {
      alert('Noget gik galt under anmodningen.');
    }
  };

  const handleCancel = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/shifts/cancel-transfer?shiftId=${selectedShift.id}&username=${username}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const message = await response.text();
    alert(message);
    closeModal();
  } catch (error) {
    alert('Noget gik galt ved annulleringen.');
  }
};

const sortedShifts = [...shifts].sort((a, b) => {
  return new Date(a.startTime) - new Date(b.startTime);
});

return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mine Vagter</h1>
      <LogoutButton />




<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {sortedShifts.map((shift) => {
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);

    const formattedStart = format(start, "dd. MMMM yyyy 'kl.' HH:mm", { locale: da });
    const formattedEnd = format(end, "dd. MMMM yyyy 'kl.' HH:mm", { locale: da });

    return (
      <li key={shift.id} className="bg-white border rounded-2xl shadow-md p-4">
        <div className="flex flex-col gap-1">
          <p><span className="font-semibold">Start:</span> {formattedStart}</p>
          <p><span className="font-semibold">Slut:</span> {formattedEnd}</p>
          <p>
            <span className="font-semibold">Tildelt til:</span>{' '}
            {shift.assignedTo ? shift.assignedTo.username : <span className="italic text-gray-500">Ingen</span>}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
              className="mt-2 text-blue-600 underline"
              onClick={() => openModal(shift)}
            >
              Anmod om byt
            </button>
        </div>
      </li>
    );
  })}
</ul>


      {/* Modal */}
      {showModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Anmod om byt</h2>
            <p className="mb-2">Vagt: {selectedShift.startTime} - {selectedShift.endTime}</p>
            <label className="block mb-2">Vælg bruger:</label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Vælg en bruger --</option>
              {users
                .filter((u) => u.username !== username)
                .map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.username}
                  </option>
                ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Annuller
              </button>
              {selectedShift.transferPending && (
  <button
    onClick={handleCancel}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Annuller byt
  </button>
)}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShifts;
