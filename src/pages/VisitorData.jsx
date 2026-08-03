import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const VisitorData = () => {
  const { user, isSuperAdmin } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState(["All Locations"]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  const [selectedIds, setSelectedIds] = useState([]);
  const [editingIds, setEditingIds] = useState([]); // Array of IDs being edited
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempVisitors, setTempVisitors] = useState([]); // Local state for inline edits

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    organizationName: "",
    numEntries: 1,
    categories: "",
    industryType: "",
    photograph_link: "",
    entries: [
      { personName: "", contactNo: "", emailId: "", photograph_link: "" },
    ],
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLocations();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchVisitors();
  }, [currentPage, pageSize, filterLocation]);

  const fetchLocations = async () => {
    try {
      const resp = await api.get("/auth/locations/");
      const locs = resp.data || [];
      setAvailableLocations(["All Locations", ...locs]);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/visitors/", {
        params: {
          page: currentPage,
          page_size: pageSize,
          location: filterLocation,
        }
      });
      
      const data = response.data.results || response.data;
      const visitorList = Array.isArray(data) ? data : [];
      setVisitors(visitorList);
      setTempVisitors(visitorList.map(v => ({ ...v }))); // Sync temp state
      setTotalCount(response.data.count || (Array.isArray(data) ? data.length : 0));
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setVisitors([]);
      setTempVisitors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/visitors/download_template/', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'visitor_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      notify.error("Failed to download template.");
    }
  };

  // const handleNumEntriesChange = (num) => {
  //   const safeNum = Math.min(Math.max(1, num), 10); // Limit to 10 for manual entry
  //   const currentEntries = [...formData.entries];
  //   let newEntries = [];
    
  //   if (safeNum > currentEntries.length) {
  //     newEntries = [...currentEntries, ...Array.from({ length: safeNum - currentEntries.length }, () => ({
  //       personName: "",
  //       contactNo: "",
  //       emailId: "",
  //       photograph_link: "",
  //     }))];
  //   } else {
  //     newEntries = currentEntries.slice(0, safeNum);
  //   }
    
  //   setFormData({ ...formData, numEntries: safeNum, entries: newEntries });
  // };
  const handleNumEntriesChange = (value) => {
  // Allow clearing the field while typing
  if (value === "") {
    setFormData({ ...formData, numEntries: "" });
    return;
  }

  const num = parseInt(value, 10);
  if (isNaN(num)) return;

  const safeNum = Math.min(Math.max(1, num), 10);
  const currentEntries = [...formData.entries];
  let newEntries = [];

  if (safeNum > currentEntries.length) {
    newEntries = [
      ...currentEntries,
      ...Array.from({ length: safeNum - currentEntries.length }, () => ({
        personName: "",
        contactNo: "",
        emailId: "",
        photograph_link: "",
      })),
    ];
  } else {
    newEntries = currentEntries.slice(0, safeNum);
  }

  setFormData({ ...formData, numEntries: safeNum, entries: newEntries });
};
  
  // const handleEntryChange = (index, field, value) => {
  //   const updatedEntries = [...formData.entries];
  //   updatedEntries[index] = { ...updatedEntries[index], [field]: value };
  //   setFormData({ ...formData, entries: updatedEntries });
  // };
  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.entries];
    const sanitized = field === "contactNo" ? value.replace(/\D/g, "") : value;
    updatedEntries[index] = { ...updatedEntries[index], [field]: sanitized };
    setFormData({ ...formData, entries: updatedEntries });
  };

  const handleSaveOrUpdate = async () => {
    try {
      const commonData = {
        company: formData.organizationName,
        categories: formData.categories,
        industry_type: formData.industryType,
        photograph_link: formData.photograph_link,
        purpose: (formData.categories || 'OTHER').toUpperCase(),
        check_in: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      };

      const promises = formData.entries.map((entry, index) => {
        const [firstName, ...lastNameParts] = entry.personName.trim().split(/\s+/);
        const visitorPayload = {
          ...commonData,
          first_name: firstName || 'N/A',
          last_name: lastNameParts.join(' ') || '.',
          email: entry.emailId,
          phone: entry.contactNo,
          photograph_link: entry.photograph_link || commonData.photograph_link,
        };

        const existingId = isEditing ? editingIds[index] : null;

        if (existingId) {
          // Update existing
          return api.patch(`/visitors/${existingId}/`, visitorPayload);
        }
        // Create new
        return api.post("/visitors/", visitorPayload);
      });

      await Promise.all(promises);
      fetchVisitors();
      setIsVisitorModalOpen(false);
      resetForm();
      setSelectedIds([]); // Clear selection after bulk update
    } catch (error) {
      console.error("Error saving visitors:", error);
      notify.error("Error saving visitors. Please check your data.");
    }
  };

  // const handleInlineChange = (index, field, value) => {
  //   const updated = [...tempVisitors];
  //   updated[index][field] = value;
  //   setTempVisitors(updated);
  // };
  const handleInlineChange = (index, field, value) => {
    const updated = [...tempVisitors];
    updated[index][field] =
      field === "phone" ? value.replace(/\D/g, "") : value;
    setTempVisitors(updated);
  };

  const handleSaveInline = async () => {
    try {
      setIsLoading(true);
      const changedVisitors = tempVisitors.filter((v, i) => {
        const original = visitors[i];
        return JSON.stringify(v) !== JSON.stringify(original);
      });

      if (changedVisitors.length === 0) {
        setIsInlineEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedVisitors.map((v) =>
        api.patch(`/visitors/${v.id}/`, {
          first_name: v.first_name,
          last_name: v.last_name,
          email: v.email,
          phone: v.phone,
          company: v.company,
          categories: v.categories,
          photograph_link: v.photograph_link,
          industry_type: v.industry_type,
          purpose: (v.categories || "OTHER").toUpperCase(),
        }),
      );

      await Promise.all(promises);
      await fetchVisitors();
      setIsInlineEditing(false);
      notify.success("All changes saved successfully!");
    } catch (error) {
      console.error("Error saving inline edits:", error);
      notify.error("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVisitor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) return;
    try {
      await api.delete(`/visitors/${id}/`);
      fetchVisitors();
    } catch (error) {
      notify.error("Failed to delete visitor.");
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      await api.post('/visitors/bulk_upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchVisitors();
      setIsBulkUploadOpen(false);
      setUploadFile(null);
    } catch (error) {
      notify.error("Bulk upload failed. Ensure the file format is correct.");
    }
  };

  // const resetForm = () => {
  //   setIsEditing(false);
  //   setEditingIds([]);
  //   setFormData({
  //     date: new Date().toISOString().split('T')[0],
  //     organizationName: "",
  //     numEntries: 1,
  //     categories: "",
  //     industryType: "",
  //     entries: [{ personName: "", contactNo: "", emailId: "", photograph_link: "" }],
  //   });
  // };

  const resetForm = () => {
    setIsEditing(false);
    setEditingIds([]);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      organizationName: "",
      numEntries: 1,
      categories: "",
      industryType: "", // already here — just ensure it's reset
      entries: [
        { personName: "", contactNo: "", emailId: "", photograph_link: "" },
      ],
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Visitor Management
          </h1>
          <p className="text-gray-500">
            View and manage factory visitors for{" "}
            {user?.location || "All Locations"}
          </p>
        </div>
        <div className="flex gap-3">
          {isSuperAdmin && (
            <select
              value={filterLocation}
              onChange={(e) => {
                setFilterLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-blue-200 rounded-lg text-blue-600 font-bold bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              if (isInlineEditing) {
                handleSaveInline();
              } else {
                setIsInlineEditing(true);
              }
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
              isInlineEditing
                ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
            }`}
          >
            {isInlineEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
          </button>

          {isInlineEditing && (
            <button
              onClick={() => {
                setIsInlineEditing(false);
                setTempVisitors(visitors.map((v) => ({ ...v })));
              }}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
            >
              Cancel
            </button>
          )}

          {!isInlineEditing && (
            <button
              onClick={() => setIsBulkUploadOpen(true)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
            >
              Bulk Upload
            </button>
          )}

          <button
            onClick={() => {
              resetForm();
              setIsVisitorModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-medium"
          >
            + Register Visitor
          </button>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          title={`iFactory Visitor List ${isInlineEditing ? "(Edit Mode Active)" : ""}`}
          columns={[
            { header: "Sr No.", render: (_, index) => index + 1 },
            {
              header: "Date",
              render: (row) =>
                row.check_in
                  ? new Date(row.check_in).toLocaleDateString()
                  : "-",
            },
            {
              header: "Organization",
              render: (row, i) =>
                isInlineEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempVisitors[i]?.company || ""}
                    onChange={(e) =>
                      handleInlineChange(i, "company", e.target.value)
                    }
                  />
                ) : (
                  row.company || "-"
                ),
            },
            {
              header: "Full Name",
              render: (row, i) =>
                isInlineEditing ? (
                  <div className="flex gap-1">
                    <input
                      className="w-1/2 px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                      placeholder="First"
                      value={tempVisitors[i]?.first_name || ""}
                      onChange={(e) =>
                        handleInlineChange(i, "first_name", e.target.value)
                      }
                    />
                    <input
                      className="w-1/2 px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Last"
                      value={tempVisitors[i]?.last_name || ""}
                      onChange={(e) =>
                        handleInlineChange(i, "last_name", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  `${row.first_name} ${row.last_name}`
                ),
            },
            {
              header: "Contact No.",
              render: (row, i) =>
                isInlineEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempVisitors[i]?.phone || ""}
                    onChange={(e) =>
                      handleInlineChange(i, "phone", e.target.value)
                    }
                  />
                ) : (
                  row.phone || "-"
                ),
            },
            {
              header: "Categories",
              render: (row, i) =>
                isInlineEditing ? (
                  <select
                    className="w-full px-1 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                    value={tempVisitors[i]?.categories || ""}
                    onChange={(e) =>
                      handleInlineChange(i, "categories", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Government">Government</option>
                    <option value="Academic">Academic</option>
                  </select>
                ) : (
                  row.categories || "-"
                ),
            },
            {
              header: "Industry Type",
              render: (row, i) =>
                isInlineEditing ? (
                  <select
                    className="w-full px-1 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                    value={tempVisitors[i]?.industry_type || ""}
                    onChange={(e) =>
                      handleInlineChange(i, "industry_type", e.target.value)
                    }
                  >
                    <option value="MSME">MSME</option>
                    <option value="OEM">OEM</option>
                    <option value="Start-Up">Start-Up</option>
                  </select>
                ) : (
                  row.industry_type || "-"
                ),
            },
            { header: "Location", accessor: "location" },
            {
              header: "Photograph Link",
              render: (row, i) =>
                isInlineEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempVisitors[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleInlineChange(i, "photograph_link", e.target.value)
                    }
                  />
                ) : (
                  row.photograph_link || "-"
                ),
            },
            {
              header: "Actions",
              render: (row) =>
                !isInlineEditing && (
                  <button
                    onClick={() => handleDeleteVisitor(row.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                ),
            },
          ]}
          data={visitors}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            totalCount,
            pageSize,
            onPageChange: (page) => setCurrentPage(page),
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
          }}
        />
      </section>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        title={isEditing ? "Edit iFactory Visitor" : "Add iFactory Visitors"}
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              Fill details for visitors belonging to the same organization. For
              multiple people, increase "No. of Entries".
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              {/* <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              /> */}
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                max={new Date().toISOString().split("T")[0]} // ← add this
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tata Motors"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entries
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.numEntries}
                onChange={(e) =>
                  handleNumEntriesChange(parseInt(e.target.value) || 1)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.categories}
                onChange={(e) =>
                  setFormData({ ...formData, categories: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <option value="Industrial">Industrial</option>
                <option value="Government">Government</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.industryType}
                onChange={(e) =>
                  setFormData({ ...formData, industryType: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="MSME">MSME</option>
                <option value="OEM">OEM</option>
                <option value="Start-Up">Start-Up</option>
              </select>
            </div>
          </div> */}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entries
              </label>

              
              {/* <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.numEntries}
                onChange={(e) =>
                  handleNumEntriesChange(parseInt(e.target.value) || 1)
                }
              /> */}
              
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.numEntries}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumEntriesChange(e.target.value)}
                onBlur={() => {
                  if (formData.numEntries === "" || formData.numEntries < 1) {
                    handleNumEntriesChange("1");
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                value={formData.categories}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categories: e.target.value,
                    industryType: "",
                  })
                }
              >
                <option value="">Select Category</option>
                <option value="Industrial">Industrial</option>
                <option value="Government">Government</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            {/* Only show Industry Type when category is Industrial */}
            {formData.categories === "Industrial" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors"
                  value={formData.industryType}
                  onChange={(e) =>
                    setFormData({ ...formData, industryType: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="MSME">MSME</option>
                  <option value="OEM">OEM</option>
                  <option value="Start-Up">Start-Up</option>
                </select>
              </div>
            )}
          </div>
          <div className="grid  gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Photo Link{" "}
              </label>
              <input
                type="text"
                placeholder="Google drive photograph link"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.photograph_link}
                onChange={(e) =>
                  setFormData({ ...formData, photograph_link: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Visitor Details
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {formData.entries.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Full Name"
                      className="px-3 py-2 border rounded-lg text-sm outline-none"
                      value={entry.personName}
                      onChange={(e) =>
                        handleEntryChange(index, "personName", e.target.value)
                      }
                    />
                    <input
                      placeholder="Contact No"
                      className="px-3 py-2 border rounded-lg text-sm outline-none"
                      value={entry.contactNo}
                      onChange={(e) =>
                        handleEntryChange(index, "contactNo", e.target.value)
                      }
                    />
                    <input
                      placeholder="Email ID"
                      className="px-3 py-2 border rounded-lg text-sm outline-none col-span-2"
                      value={entry.emailId}
                      onChange={(e) =>
                        handleEntryChange(index, "emailId", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsVisitorModalOpen(false)}
              className="px-6 py-2 text-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOrUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition-all"
            >
              {isEditing ? "Update & Save All" : "Save All Visitors"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Visitors"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="text-xs text-amber-800">
              <strong>Need a template?</strong> Download our CSV format to
              ensure your data uploads correctly.
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-md hover:bg-amber-700 transition-colors font-bold whitespace-nowrap"
            >
              Download Template
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="hidden"
              id="visitor-upload"
            />
            <label htmlFor="visitor-upload" className="cursor-pointer">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-600">
                {uploadFile
                  ? uploadFile.name
                  : "Click to select CSV or Excel file"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Required columns: first_name, last_name, email, phone, company
              </p>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsBulkUploadOpen(false)}
              className="px-4 py-2 text-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpload}
              disabled={!uploadFile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              Upload & Process
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisitorData;
