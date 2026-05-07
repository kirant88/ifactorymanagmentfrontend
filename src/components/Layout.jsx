import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Activity,
  RadioTower,
  Factory,
  Wrench,
  Settings,
  LogOut,
  User as UserIcon,
  BarChart3,
} from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/visitor-data", icon: Users, label: "Visitor Data" },
    { path: "/digital-maturity", icon: Activity, label: "Training & DMA" },
    { path: "/engagement", icon: RadioTower, label: "Engagements" },
    { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    {
      path: "/iFactoryMonthlyReport",
      icon: Factory,
      label: "Monthly Report",
    },
    {
      path: "/daily-weekly-report",
      icon: Activity,
      label: "Daily / Weekly Report",
    },
    {
      path: "/overall-monthly-report",
      icon: BarChart3,
      label: "Overall Report",
      adminOnly: true,
    },
    { path: "/admin", icon: Settings, label: "Admin Access", adminOnly: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="no-print w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">iFactory</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Management
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems
            .filter((item) => !item.adminOnly || user?.role === "SUPERADMIN")
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-medium"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto print:overflow-visible print:h-auto bg-[#F8FAFC]">
        <header className="no-print bg-white/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {window.location.pathname === "/"
              ? "Dashboard Overview"
              : "iFactory Management"}
          </h2>

          {/* User Info */}
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setIsAdminModalOpen(true)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {user?.full_name || "Admin User"}
              </p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                {user?.role} • {user?.location || "All Locations"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              {user?.full_name?.charAt(0) || <UserIcon size={20} />}
            </div>
          </div>
        </header>

        <main className="p-8 print:p-0">
          <Outlet />
        </main>
      </div>

      {/* Profile/Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAdminModalOpen(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4">
                {user?.full_name?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {user?.full_name}
              </h3>
              <p className="text-blue-600 font-medium">{user?.role}</p>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  Email
                </span>
                <span className="font-medium text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  Location
                </span>
                <span className="font-medium text-gray-800">
                  {user?.location || "Global"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  Organization
                </span>
                <span className="font-medium text-gray-800">
                  {user?.organization_name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                  Joined
                </span>
                <span className="font-medium text-gray-800">
                  {new Date(user?.date_joined).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="mt-8 w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
