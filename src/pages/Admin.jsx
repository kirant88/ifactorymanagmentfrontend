import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import { Users, UserCheck, ShieldAlert, Plus, Trash2, Key, Edit, Info } from "lucide-react";

const Admin = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "VIEWER",
    location: "",
    organization_name: "",
    phone: "",
    password: "",
    password_confirm: "",
    is_active: true,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirm: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/users/", {
        params: {
          page: currentPage,
          page_size: pageSize
        }
      });
      const data = response.data.results || response.data;
      setUsers(data);
      setTotalCount(response.data.count || (Array.isArray(data) ? data.length : 0));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/auth/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      role: "VIEWER",
      location: "",
      organization_name: "",
      phone: "",
      password: "",
      password_confirm: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      location: user.location || "",
      organization_name: user.organization_name || "",
      phone: user.phone || "",
      is_active: user.is_active,
    });
    setIsModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordData({ password: "", password_confirm: "" });
    setIsPasswordModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === "create") {
        if (formData.password !== formData.password_confirm) {
          notify.error("Passwords do not match!");
          return;
        }
        await api.post("/auth/register/", formData);
      } else {
        await api.patch(`/auth/users/${selectedUser.id}/`, formData);
      }
      
      setIsModalOpen(false);
      fetchUsers();
      fetchStats();
      notify.success(modalMode === "create" ? "User created successfully!" : "User updated successfully!");
    } catch (error) {
      const errorMsg = error.response?.data ? Object.values(error.response.data)[0] : "Operation failed";
      notify.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirm) {
      notify.error("Passwords do not match!");
      return;
    }

    try {
      await api.post(`/auth/users/${selectedUser.id}/reset-password/`, passwordData);
      setIsPasswordModalOpen(false);
      notify.success("Password reset successfully!");
    } catch (error) {
      notify.error("Failed to reset password.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.user_id) {
      notify.info("You cannot delete yourself!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/auth/users/${userId}/`);
        fetchUsers();
        fetchStats();
        notify.success("User deleted successfully!");
      } catch (error) {
        notify.error("Failed to delete user.");
      }
    }
  };

  const statsCards = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Admins", value: stats?.admins_count || 0, icon: ShieldAlert, color: "bg-purple-50 text-purple-600" },
    { label: "Active Users", value: stats?.active_users || 0, icon: UserCheck, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Access Control</h3>
            <p className="text-sm text-gray-500">Manage organizational access and user roles</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Create New User
          </button>
        </div>

        <DataTable
          title="User Management"
          isLoading={isLoading}
          columns={[
            { header: "Name", render: (row) => `${row.first_name} ${row.last_name}` },
            { header: "Email", accessor: "email" },
            { 
              header: "Role", 
              render: (row) => (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  row.role === 'SUPERADMIN' ? 'bg-red-100 text-red-600' : 
                  row.role === 'LOCATIONADMIN' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {row.role.replace('_', ' ')}
                </span>
              )
            },
            { header: "Location", render: (row) => row.location || 'Global' },
            { header: "Organization", render: (row) => row.organization_name || 'N/A' },
            { 
              header: "Status", 
              render: (row) => (
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${row.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium">{row.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              )
            },
            {
              header: "Actions",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(row)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => openPasswordModal(row)}
                    className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Reset Password"
                  >
                    <Key size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(row.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            }
          ]}
          data={users}
          pagination={{
            currentPage,
            totalPages,
            totalCount,
            pageSize,
            onPageChange: (page) => setCurrentPage(page),
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            }
          }}
        />
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Create New User Account" : "Edit User Details"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode === "edit" && (
            <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-3 border border-blue-100 mb-4">
              <Info className="text-blue-500 mt-0.5" size={18} />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Editing account: <span className="font-bold underline">{formData.email}</span>. 
                Role and location changes will take effect on their next login.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">First Name</label>
              <input
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Last Name</label>
              <input
                required
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          {modalMode === "create" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Address</label>
              <input
                required
                type="email"
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Role</label>
              <select
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {currentUser?.role === 'SUPERADMIN' && <option value="SUPERADMIN">Super Admin</option>}
                <option value="LOCATIONADMIN">Location Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Location Access</label>
              <input
                placeholder="e.g. Indore, Pune"
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Organization Name</label>
            <input
              placeholder="e.g. Symbiosis University"
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
              <input
                className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            {modalMode === "edit" && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Account Status</label>
                <select
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive / Blocked</option>
                </select>
              </div>
            )}
          </div>

          {modalMode === "create" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase flex items-center gap-1">
                  <Key size={12} /> Password
                </label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Confirm Password</label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="pt-6 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wider text-xs"
            >
              {modalMode === "create" ? "Register Account" : "Update Account"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Admin Password Reset"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl flex items-start gap-3 border border-amber-100 mb-2">
            <Key className="text-amber-500 mt-0.5" size={18} />
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              You are resetting the password for: <span className="font-bold underline">{selectedUser?.email}</span>. 
              The user will need to use this new password for their next login.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">New Password</label>
            <input
              required
              type="password"
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              value={passwordData.password}
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Confirm New Password</label>
            <input
              required
              type="password"
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
              value={passwordData.password_confirm}
              onChange={(e) => setPasswordData({ ...passwordData, password_confirm: e.target.value })}
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/30 transition-all uppercase tracking-wider text-xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
