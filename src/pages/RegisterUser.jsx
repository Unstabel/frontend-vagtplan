import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER', // eller lad brugeren vælge
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setMessage('');

  const token = localStorage.getItem('token'); // ⬅️ Get the token

  if (!token) {
    setError('Du er ikke logget ind.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ⬅️ Add the token here
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registrering fejlede.');
    }

    setMessage('Bruger oprettet!');
    setFormData({ username: '', password: '', role: 'USER' });
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        <button
        onClick={() => navigate('/admin')}
        className="left-6 top-6 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Tilbage
      </button>
      <h1 className="text-2xl font-bold mb-4">Opret ny bruger</h1>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Brugernavn</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Adgangskode</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Rolle</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="USER">Bruger</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Registrer
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
