import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import MyShifts from './pages/My-Shifts.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ShiftOverview from './pages/ShiftOverview.jsx';
import TransferRequests from './pages/TransferRequests.jsx';
import RegisterUser from './pages/RegisterUser.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/my-shifts" element={<MyShifts />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/shifts" element={<ShiftOverview />} />
        <Route path="/admin/transfer-requests" element={<TransferRequests />} />
        <Route path="/admin/register-user" element={<RegisterUser/>} />
      </Routes>
    </Router>
  );
};

export default App;
