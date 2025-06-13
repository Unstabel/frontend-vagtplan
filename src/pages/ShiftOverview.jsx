import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { da } from 'date-fns/locale'

const ShiftOverview = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [editedShift, setEditedShift] = useState({
    startTime: '',
    endTime: '',
    assignedToUsername: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShift, setNewShift] = useState({
    startTime: '',
    endTime: '',
    assignedToUsername: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('http://localhost:8080/shifts/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Fejl ved hentning af vagter');
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        console.error('Fejl ved hentning af vagter', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/shifts/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Fejl ved hentning af brugere');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Fejl ved hentning af brugere', error);
      }
    };

    fetchShifts();
    fetchUsers();
  }, [token]);

  // --- Edit modal handlers ---
  const openEditModal = (shift) => {
    setSelectedShift(shift);
    setEditedShift({
      startTime: shift.startTime,
      endTime: shift.endTime,
      assignedToUsername: shift.assignedTo ? shift.assignedTo.username : '',
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedShift(null);
    setEditedShift({ startTime: '', endTime: '', assignedToUsername: '' });
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedShift((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateShift = async () => {
    if (!selectedShift) return;

    const assignedUser = users.find(u => u.username === editedShift.assignedToUsername);

    const updatedShift = {
      ...selectedShift,
      startTime: editedShift.startTime,
      endTime: editedShift.endTime,
      assignedTo: assignedUser || null,
    };

    try {
      const response = await fetch(`http://localhost:8080/shifts/${selectedShift.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedShift),
      });

      if (!response.ok) throw new Error('Fejl ved opdatering af vagt');

      const updated = await response.json();

      setShifts((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      closeEditModal();
    } catch (error) {
      alert('Noget gik galt ved opdatering.');
      console.error(error);
    }
  };

  // Delete shift 
  const handleDeleteShift = async (id) => {
    if (!window.confirm('Er du sikker på, du vil slette denne vagt?')) return;

    try {
      const response = await fetch(`http://localhost:8080/shifts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Fejl ved sletning af vagt');

      setShifts((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert('Noget gik galt ved sletning.');
      console.error(error);
    }
  };

  // Create modal handlers
  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewShift({ startTime: '', endTime: '', assignedToUsername: '' });
  };

  const handleNewShiftChange = (e) => {
    const { name, value } = e.target;
    setNewShift(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateShift = async () => {
    if (!newShift.startTime || !newShift.endTime || !newShift.assignedToUsername) {
      alert('Udfyld alle felter');
      return;
    }

    const shiftData = {
      startTime: newShift.startTime,
      endTime: newShift.endTime,
    };

    try {
      const response = await fetch(`http://localhost:8080/shifts/create?username=${newShift.assignedToUsername}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shiftData),
      });

      const message = await response.text();

      if (!response.ok) {
        alert('Fejl ved oprettelse: ' + message);
        return;
      }

      alert(message);
      closeCreateModal();

      // Opdater listen
      const fetchShifts = async () => {
        const res = await fetch('http://localhost:8080/shifts/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShifts(data);
      };
      fetchShifts();
    } catch (error) {
      alert('Noget gik galt ved oprettelse');
      console.error(error);
    }
  };

  const sortedShifts = [...shifts].sort((a, b) => {
  return new Date(a.startTime) - new Date(b.startTime);
});

  return (
    <div className="p-6 relative min-h-screen">
      {/* Tilbage knap venstre hjørne */}
      <button
        onClick={() => navigate('/admin')}
        className="left-6 top-6 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Tilbage
      </button>

      {/* Opret vagt knap højre hjørne */}
      <button
        onClick={openCreateModal}
        className="absolute right-6 top-6 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Opret vagt
      </button>

      <h1 className="text-2xl font-bold mb-4">Vagtoversigt</h1>

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
            onClick={() => openEditModal(shift)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1.5 px-4 rounded-lg"
          >
            Ændre
          </button>
          <button
            onClick={() => handleDeleteShift(shift.id)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-lg"
          >
            Slet
          </button>
        </div>
      </li>
    );
  })}
</ul>

      {/* Edit Modal */}
      {showEditModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Ændr vagt</h2>

            <label className="block mb-1 font-semibold">Start tid</label>
            <input
              type="datetime-local"
              name="startTime"
              value={editedShift.startTime}
              onChange={handleEditChange}
              className="border p-2 mb-4 w-full rounded"
            />

            <label className="block mb-1 font-semibold">Slut tid</label>
            <input
              type="datetime-local"
              name="endTime"
              value={editedShift.endTime}
              onChange={handleEditChange}
              className="border p-2 mb-4 w-full rounded"
            />

            <label className="block mb-1 font-semibold">Tildelt til</label>
            <select
              name="assignedToUsername"
              value={editedShift.assignedToUsername}
              onChange={handleEditChange}
              className="border p-2 mb-4 w-full rounded"
            >
              <option value="">-- Vælg bruger --</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdateShift}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Gem
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Annuller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Opret ny vagt</h2>

            <label className="block mb-1 font-semibold">Start tid</label>
            <input
              type="datetime-local"
              name="startTime"
              value={newShift.startTime}
              onChange={handleNewShiftChange}
              className="border p-2 mb-4 w-full rounded"
            />

            <label className="block mb-1 font-semibold">Slut tid</label>
            <input
              type="datetime-local"
              name="endTime"
              value={newShift.endTime}
              onChange={handleNewShiftChange}
              className="border p-2 mb-4 w-full rounded"
            />

            <label className="block mb-1 font-semibold">Tildelt til</label>
            <select
              name="assignedToUsername"
              value={newShift.assignedToUsername}
              onChange={handleNewShiftChange}
              className="border p-2 mb-4 w-full rounded"
            >
              <option value="">-- Vælg bruger --</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCreateShift}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Opret
              </button>
              <button
                onClick={closeCreateModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Annuller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftOverview;
