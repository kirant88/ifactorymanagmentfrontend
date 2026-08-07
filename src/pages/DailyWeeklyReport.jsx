import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, FileText, ChevronLeft, ChevronRight, X, ExternalLink, Trash2 } from "lucide-react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useConfirmDialog } from "../components/ConfirmDialog";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const DailyWeeklyReport = () => {
  const { user } = useAuth();
  const { confirm, dialog: confirmDialog } = useConfirmDialog();
  const [activeTab, setActiveTab] = useState("daily");
  
  // Daily Report State
  const [dailyReports, setDailyReports] = useState([]);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Weekly Report State
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  
  // Form States
  const [dailyFormData, setDailyFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    po_numbers: [""],
    reason: "",
  });
  
  const [weeklyFormData, setWeeklyFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    photo_link: "",
  });

  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState(["All Locations"]);
  const isSuperAdminUser = user?.role === "SUPERADMIN";

  useEffect(() => {
    fetchDailyReports();
    fetchWeeklyReports();
    if (isSuperAdminUser) {
      fetchLocations();
    }
  }, [filterLocation]);

  const todayStr = new Date().toISOString().split("T")[0];
  const firstDayOfMonthStr = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];

  const fetchLocations = async () => {
    try {
      const resp = await api.get("/auth/locations/");
      const locs = resp.data || [];
      setAvailableLocations(["All Locations", ...locs]);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchDailyReports = async () => {
    try {
      setIsLoadingDaily(true);
      const params = {};
      if (filterLocation !== "All Locations") {
        params.location = filterLocation;
      }
      const res = await api.get("/reports/daily-pump/", { params });
      setDailyReports(res.data.results || res.data);
    } catch (error) {
      console.error("Error fetching daily reports", error);
    } finally {
      setIsLoadingDaily(false);
    }
  };

  const fetchWeeklyReports = async () => {
    try {
      setIsLoadingWeekly(true);
      const params = {};
      if (filterLocation !== "All Locations") {
        params.location = filterLocation;
      }
      const res = await api.get("/reports/weekly-social/", { params });
      setWeeklyReports(res.data.results || res.data);
    } catch (error) {
      console.error("Error fetching weekly reports", error);
    } finally {
      setIsLoadingWeekly(false);
    }
  };

  const handleDailySubmit = async () => {
    try {
      const payload = {
        ...dailyFormData,
        po_numbers: dailyFormData.po_numbers.filter(po => po.trim() !== "")
      };
      await api.post("/reports/daily-pump/", payload);
      setIsDailyModalOpen(false);
      setDailyFormData({ date: new Date().toISOString().split("T")[0], po_numbers: [""], reason: "" });
      fetchDailyReports();
    } catch (error) {
      notify.error("Error saving daily report");
    }
  };

  const handleWeeklySubmit = async () => {
    try {
      await api.post("/reports/weekly-social/", weeklyFormData);
      setIsWeeklyModalOpen(false);
      setWeeklyFormData({ date: new Date().toISOString().split("T")[0], photo_link: "" });
      fetchWeeklyReports();
    } catch (error) {
      notify.error("Error saving weekly report");
    }
  };

  const addPoNumber = () => {
    setDailyFormData({ ...dailyFormData, po_numbers: [...dailyFormData.po_numbers, ""] });
  };

  const updatePoNumber = (index, value) => {
    const newPos = [...dailyFormData.po_numbers];
    newPos[index] = value;
    setDailyFormData({ ...dailyFormData, po_numbers: newPos });
  };

  // Calendar Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const [selectedDayReports, setSelectedDayReports] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const reportsForDay = Array.isArray(dailyReports) ? dailyReports.filter(r => r.date === dateStr) : [];
      const totalPo = reportsForDay.reduce((acc, r) => acc + (r.po_numbers?.length || 0), 0);

      days.push(
        <div 
          key={day} 
          onClick={() => {
            if (reportsForDay.length > 0) {
              setSelectedDayReports(reportsForDay);
              setIsDetailModalOpen(true);
            }
          }}
          className="h-24 bg-white border border-gray-100 p-2 hover:bg-blue-50 transition-colors group relative overflow-y-auto cursor-pointer"
        >
          <span className="text-sm font-bold text-gray-400 group-hover:text-blue-600">{day}</span>
          {totalPo > 0 && (
            <div className="mt-1">
              <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full inline-block font-bold">
                {totalPo} PO{totalPo > 1 ? 's' : ''}
              </div>
              <div className="mt-1 space-y-1">
                {reportsForDay.map((r, idx) => (
                    <div key={idx} className="text-[10px] text-gray-500 truncate" title={r.reason}>
                        • {r.reason}
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500">
            Manage Daily Pump and Weekly Social Media Reports
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {isSuperAdminUser && (
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <span className="text-sm font-bold text-gray-500 px-2">
                Location:
              </span>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-white border-none rounded-md px-3 py-1.5 text-sm font-bold text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab("daily")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold transition-all ${activeTab === "daily" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Daily Pump
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold transition-all ${activeTab === "weekly" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Weekly Social Media
            </button>
          </div>
        </div>
      </div>

      {activeTab === "daily" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-blue-50/30">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                    ),
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                    ),
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => setIsDailyModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg  transition-all font-bold flex items-center gap-2"
                >
              <Plus size={18} />
              Add Pump Data
            </button>
          </div>

          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">{renderCalendar()}</div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsWeeklyModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Add Weekly Report
            </button>
          </div>

          <DataTable
            title="Weekly Social Media Reports"
            isLoading={isLoadingWeekly}
            columns={[
              { header: "Date", accessor: "date" },
              {
                header: "Photo Link",
                render: (row) => (
                  <a
                    href={row.photo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    View Link <ExternalLink size={14} />
                  </a>
                ),
              },
              { header: "Location", accessor: "location" },
              { header: "Added By", accessor: "added_by_name" },
              {
                header: "Actions",
                render: (row) => (
                  <button
                    onClick={async () => {
                      const ok = await confirm({
                        title: "Delete Report",
                        message: "Are you sure you want to delete this weekly report? This action cannot be undone.",
                        confirmLabel: "Delete",
                      });
                      if (!ok) return;
                      try {
                        await api.delete(`/reports/weekly-social/${row.id}/`);
                        fetchWeeklyReports();
                        notify.success("Weekly report deleted successfully!");
                      } catch (error) {
                        notify.error("Failed to delete weekly report.");
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                ),
              },
            ]}
            data={weeklyReports}
          />
        </div>
      )}

      {/* Daily Modal */}
      <Modal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        title="Add Daily Pump Data"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={dailyFormData.date}
              min={firstDayOfMonthStr}
              max={new Date().toISOString().split("T")[0]} // ← add this
              onChange={(e) =>
                setDailyFormData({ ...dailyFormData, date: e.target.value })
              }
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">
                PO Numbers
              </label>
              <button
                onClick={addPoNumber}
                className="text-xs text-blue-600 font-bold hover:underline hover:text-blue-700"
              >
                + Add Another PO
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto p-1 border rounded-lg bg-gray-50 border-dashed">
              {dailyFormData.po_numbers.map((po, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`PO Number ${idx + 1}`}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={po}
                    onChange={(e) => updatePoNumber(idx, e.target.value)}
                  />
                  {dailyFormData.po_numbers.length > 1 && (
                    <button
                      onClick={() => {
                        const newPos = dailyFormData.po_numbers.filter(
                          (_, i) => i !== idx,
                        );
                        setDailyFormData({
                          ...dailyFormData,
                          po_numbers: newPos,
                        });
                      }}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="Enter reason for pump report..."
              value={dailyFormData.reason}
              onChange={(e) =>
                setDailyFormData({ ...dailyFormData, reason: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsDailyModalOpen(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDailySubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700  font-bold transition-all"
            >
              Submit Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Weekly Modal */}
      <Modal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        title="Add Weekly Social Media Report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={weeklyFormData.date}
              min={firstDayOfMonthStr}
              max={new Date().toISOString().split("T")[0]} // ← add this
              onChange={(e) =>
                setWeeklyFormData({ ...weeklyFormData, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Photo Link
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={weeklyFormData.photo_link}
              onChange={(e) =>
                setWeeklyFormData({
                  ...weeklyFormData,
                  photo_link: e.target.value,
                })
              }
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsWeeklyModalOpen(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleWeeklySubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold transition-all"
            >
              Submit Weekly Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Reports for ${selectedDayReports[0]?.date}`}
      >
        <div className="space-y-6">
          {selectedDayReports.map((report, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Report #{idx + 1}
                </span>
                <span className="text-xs text-gray-400">{report.location}</span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2">
                  PO Numbers:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.po_numbers.map((po, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-1 bg-white border border-blue-100 text-blue-700 text-xs font-bold rounded-lg shadow-sm"
                    >
                      {po}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-1">
                  Reason:
                </h4>
                <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 italic">
                  "{report.reason}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                <span>Added by: {report.added_by_name}</span>
                <button
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Delete Daily Report",
                      message: "Are you sure you want to delete this daily report? This action cannot be undone.",
                      confirmLabel: "Delete",
                    });
                    if (!ok) return;
                    try {
                      await api.delete(`/reports/daily-pump/${report.id}/`);
                      setIsDetailModalOpen(false);
                      fetchDailyReports();
                      notify.success("Daily report deleted successfully!");
                    } catch (error) {
                      notify.error("Failed to delete daily report.");
                    }
                  }}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end border-t">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      {confirmDialog}
    </div>
  );
};

export default DailyWeeklyReport;
