import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminDashboard = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-4">
        <Link
          to="/admin/shifts"
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow transition duration-300 text-lg"
        >
          Vagtoversigt
        </Link>

        <Link
          to="/admin/transfer-requests"
          className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl shadow transition duration-300 text-lg"
        >
          Bytteanmodninger
        </Link>

        <Link
          to="/admin/register-user"
          className="block text-center bg-orange-700 hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-2xl shadow transition duration-300 text-lg"
        >
          Registrering af nye brugere
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
