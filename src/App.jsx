import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import VisitorData from "./pages/VisitorData";
import DigitalMaturity from "./pages/DigitalMaturity";
import Engagement from "./pages/Engagement";
import Maintenance from "./pages/Maintenance";
import IFactoryMonthlyReport from "./pages/IFactoryMonthlyReport";
import OverallMonthlyReport from "./pages/OverallMonthlyReport";
import DailyWeeklyReport from "./pages/DailyWeeklyReport";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="visitor-data" element={<VisitorData />} />
          <Route path="digital-maturity" element={<DigitalMaturity />} />
          <Route path="engagement" element={<Engagement />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route
            path="iFactoryMonthlyReport"
            element={<IFactoryMonthlyReport />}
          />
          <Route path="daily-weekly-report" element={<DailyWeeklyReport />} />

          {/* Admin only routes */}
          <Route element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} />}>
            <Route path="admin" element={<Admin />} />
            <Route
              path="overall-monthly-report"
              element={<OverallMonthlyReport />}
            />
          </Route>
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
