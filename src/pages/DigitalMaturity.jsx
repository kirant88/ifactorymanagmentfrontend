import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { Plus, Upload as UploadIcon } from "lucide-react";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const DigitalMaturity = () => {
  const { user, isSuperAdmin } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isMaturityModalOpen, setIsMaturityModalOpen] = useState(false);
  const [isTrainingBulkOpen, setIsTrainingBulkOpen] = useState(false);
  const [isMaturityBulkOpen, setIsMaturityBulkOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState([
    "All Locations",
  ]);

  // Pagination states
  const [trainPage, setTrainPage] = useState(1);
  const [trainPageSize, setTrainPageSize] = useState(10);
  const [trainTotal, setTrainTotal] = useState(0);

  const [assessPage, setAssessPage] = useState(1);
  const [assessPageSize, setAssessPageSize] = useState(10);
  const [assessTotal, setAssessTotal] = useState(0);

  // Edit mode states for both tables
  const [isTrainingEditing, setIsTrainingEditing] = useState(false);
  const [tempTrainings, setTempTrainings] = useState([]);

  const [isAssessmentEditing, setIsAssessmentEditing] = useState(false);
  const [tempAssessments, setTempAssessments] = useState([]);

  const [trainingForm, setTrainingForm] = useState({
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

  const [maturityForm, setMaturityForm] = useState({
    organizationName: "",
    activityType: "",
    totalAssessments: 0,
    totalImpact: "",
    paymentType: "FREE",
    photograph_link: "",
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLocations();
    }
  }, [isSuperAdmin]);

  const fetchLocations = async () => {
    try {
      const resp = await api.get("/auth/locations/");
      const locs = resp.data || [];
      setAvailableLocations(["All Locations", ...locs]);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trainPage, trainPageSize, assessPage, assessPageSize, filterLocation]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = { location: filterLocation };
      const [trainRes, assessRes] = await Promise.all([
        api.get("/training/", {
          params: { ...params, page: trainPage, page_size: trainPageSize },
        }),
        api.get("/training/assessment/", {
          params: { ...params, page: assessPage, page_size: assessPageSize },
        }),
      ]);

      setTrainings(trainRes.data.results || trainRes.data);
      setTempTrainings(
        (trainRes.data.results || trainRes.data).map((t) => ({ ...t })),
      );
      setTrainTotal(trainRes.data.count || 0);

      setAssessments(assessRes.data.results || assessRes.data);
      setTempAssessments(
        (assessRes.data.results || assessRes.data).map((a) => ({ ...a })),
      );
      setAssessTotal(assessRes.data.count || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Training Form Handlers
  // const handleNumEntriesChange = (num) => {
  //   const safeNum = Math.min(Math.max(1, num), 10);
  //   const updatedEntries = [...trainingForm.entries];
  //   if (safeNum > updatedEntries.length) {
  //     for (let i = updatedEntries.length; i < safeNum; i++) {
  //       updatedEntries.push({
  //         personName: "",
  //         contactNo: "",
  //         emailId: "",
  //         photograph_link: "",
  //       });
  //     }
  //   } else {
  //     updatedEntries.splice(safeNum);
  //   }
  //   setTrainingForm({
  //     ...trainingForm,
  //     numEntries: safeNum,
  //     entries: updatedEntries,
  //   });
  // };

  const handleNumEntriesChange = (value) => {
    if (value === "") {
      setTrainingForm({ ...trainingForm, numEntries: "" });
      return;
    }
  
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
  
    const safeNum = Math.min(Math.max(1, num), 10);
    const updatedEntries = [...trainingForm.entries];
  
    if (safeNum > updatedEntries.length) {
      for (let i = updatedEntries.length; i < safeNum; i++) {
        updatedEntries.push({
          personName: "",
          contactNo: "",
          emailId: "",
          photograph_link: "",
        });
      }
    } else {
      updatedEntries.splice(safeNum);
    }
  
    setTrainingForm({
      ...trainingForm,
      numEntries: safeNum,
      entries: updatedEntries,
    });
  };

  const handleTrainingEntryChange = (index, field, value) => {
    const updatedEntries = [...trainingForm.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setTrainingForm({ ...trainingForm, entries: updatedEntries });
  };

  const handleAddTrainings = async () => {
    try {
      const payloads = trainingForm.entries.map((entry) => ({
        date: trainingForm.date,
        organization_name: trainingForm.organizationName,
        category: trainingForm.categories,
        industry_type: trainingForm.industryType,
        person_name: entry.personName,
        phone: entry.contactNo,
        email: entry.emailId,
        photograph_link: entry.photograph_link || trainingForm.photograph_link,
      }));

      for (const payload of payloads) {
        await api.post("/training/", payload);
      }

      fetchData();
      setIsTrainingModalOpen(false);
      resetTrainingForm();
    } catch (error) {
      notify.error("Error adding training records.");
    }
  };

  const resetTrainingForm = () => {
    setTrainingForm({
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
  };

  const handleTrainingBulkUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      await api.post("/training/bulk_upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchData();
      setIsTrainingBulkOpen(false);
      setUploadFile(null);
    } catch (error) {
      notify.error("Bulk upload failed.");
    }
  };

  const downloadTrainingTemplate = async () => {
    try {
      const response = await api.get("/training/download_template/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "training_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      notify.error("Failed to download template.");
    }
  };

  // Maturity Form Handlers
  const handleAddMaturity = async () => {
    try {
      await api.post("/training/assessment/", {
        organization_name: maturityForm.organizationName,
        activity_type: maturityForm.activityType,
        total_assessments: maturityForm.totalAssessments,
        total_impact: maturityForm.totalImpact,
        payment_type: maturityForm.paymentType,
        photograph_link: maturityForm.photograph_link,
      });
      fetchData();
      setIsMaturityModalOpen(false);
      setMaturityForm({
        organizationName: "",
        activityType: "",
        totalAssessments: 0,
        totalImpact: "",
        paymentType: "FREE",
        photograph_link: "",
      });
    } catch (error) {
      notify.error("Error adding assessment.");
    }
  };

  const handleMaturityBulkUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      await api.post("/training/assessment/bulk_upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchData();
      setIsMaturityBulkOpen(false);
      setUploadFile(null);
    } catch (error) {
      notify.error("Bulk upload failed.");
    }
  };

  const downloadMaturityTemplate = async () => {
    try {
      const response = await api.get(
        "/training/assessment/download_template/",
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assessment_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      notify.error("Failed to download template.");
    }
  };

  // Training inline editing handlers
  const handleTrainingInlineChange = (index, field, value) => {
    const updated = [...tempTrainings];
    updated[index][field] = value;
    setTempTrainings(updated);
  };

  const handleSaveTrainings = async () => {
    try {
      setIsLoading(true);
      const changedTrainings = tempTrainings.filter((t, i) => {
        const original = trainings[i];
        return JSON.stringify(t) !== JSON.stringify(original);
      });

      if (changedTrainings.length === 0) {
        setIsTrainingEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedTrainings.map((t) =>
        api.patch(`/training/${t.id}/`, {
          date: t.date,
          organization_name: t.organization_name,
          category: t.category,
          industry_type: t.industry_type,
          person_name: t.person_name,
          phone: t.phone,
          email: t.email,
          photograph_link: t.photograph_link,
        }),
      );

      await Promise.all(promises);
      await fetchData();
      setIsTrainingEditing(false);
      notify.success("All training changes saved successfully!");
    } catch (error) {
      console.error("Error saving training edits:", error);
      notify.error("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTrainings = () => {
    setIsTrainingEditing(false);
    setTempTrainings(trainings.map((t) => ({ ...t })));
  };

  // Assessment inline editing handlers
  const handleAssessmentInlineChange = (index, field, value) => {
    const updated = [...tempAssessments];
    updated[index][field] = value;
    setTempAssessments(updated);
  };

  const handleSaveAssessments = async () => {
    try {
      setIsLoading(true);
      const changedAssessments = tempAssessments.filter((a, i) => {
        const original = assessments[i];
        return JSON.stringify(a) !== JSON.stringify(original);
      });

      if (changedAssessments.length === 0) {
        setIsAssessmentEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedAssessments.map((a) =>
        api.patch(`/training/assessment/${a.id}/`, {
          organization_name: a.organization_name,
          activity_type: a.activity_type,
          payment_type: a.payment_type,
          total_assessments: a.total_assessments,
          total_impact: a.total_impact,
          photograph_link: a.photograph_link,
        }),
      );

      await Promise.all(promises);
      await fetchData();
      setIsAssessmentEditing(false);
      notify.success("All assessment changes saved successfully!");
    } catch (error) {
      console.error("Error saving assessment edits:", error);
      notify.error("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAssessments = () => {
    setIsAssessmentEditing(false);
    setTempAssessments(assessments.map((a) => ({ ...a })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Training & Digital Maturity
          </h1>
          <p className="text-gray-500">
            Manage iFactory Training and DMA Assessments for{" "}
            {user?.location || "All Locations"}
          </p>
        </div>
        <div className="flex gap-3">
          {isSuperAdmin && (
            <select
              value={filterLocation}
              onChange={(e) => {
                setFilterLocation(e.target.value);
                setTrainPage(1);
                setAssessPage(1);
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
        </div>
      </div>

      {/* Training Section */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">iFactory Training</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isTrainingEditing) {
                  handleSaveTrainings();
                } else {
                  setIsTrainingEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isTrainingEditing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
              }`}
            >
              {isTrainingEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
            </button>
            {isTrainingEditing && (
              <button
                onClick={handleCancelTrainings}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setIsTrainingBulkOpen(true)}
              disabled={isTrainingEditing}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all ${
                isTrainingEditing
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              <UploadIcon size={18} />
              Bulk Upload
            </button>
            <button
              onClick={() => {
                resetTrainingForm();
                setIsTrainingModalOpen(true);
              }}
              disabled={isTrainingEditing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                isTrainingEditing
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <Plus size={18} />
              Add Training
            </button>
          </div>
        </div>
        <DataTable
          // title={`iFactory Training ${isTrainingEditing ? "(Edit Mode Active)" : ""}`}
          isLoading={isLoading}
          columns={[
            { header: "Sr No.", render: (_, i) => i + 1 },
            {
              header: "Date",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.date || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(i, "date", e.target.value)
                    }
                  />
                ) : (
                  row.date || "-"
                ),
            },
            {
              header: "Organization",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.organization_name || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(
                        i,
                        "organization_name",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.organization_name || "-"
                ),
            },
            {
              header: "Category",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.category || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(i, "category", e.target.value)
                    }
                  />
                ) : (
                  row.category || "-"
                ),
            },
            {
              header: "Industry",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.industry_type || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(
                        i,
                        "industry_type",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.industry_type || "-"
                ),
            },
            {
              header: "Person Name",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.person_name || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(
                        i,
                        "person_name",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.person_name || "-"
                ),
            },
            {
              header: "Phone",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.phone || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(i, "phone", e.target.value)
                    }
                  />
                ) : (
                  row.phone || "-"
                ),
            },
            {
              header: "Email",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempTrainings[i]?.email || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(i, "email", e.target.value)
                    }
                  />
                ) : (
                  row.email || "-"
                ),
            },
            {
              header: "Photograph",
              render: (row, i) =>
                isTrainingEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    placeholder="Drive URL"
                    value={tempTrainings[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleTrainingInlineChange(
                        i,
                        "photograph_link",
                        e.target.value,
                      )
                    }
                  />
                ) : row.photograph_link ? (
                  <a
                    href={row.photograph_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Link
                  </a>
                ) : (
                  "-"
                ),
            },
          ]}
          data={trainings}
          // onAdd={() => !isTrainingEditing && setIsTrainingModalOpen(true)}
          pagination={{
            currentPage: trainPage,
            totalPages: Math.ceil(trainTotal / trainPageSize),
            totalCount: trainTotal,
            pageSize: trainPageSize,
            onPageChange: (p) => !isTrainingEditing && setTrainPage(p),
            onPageSizeChange: (s) => {
              if (!isTrainingEditing) {
                setTrainPageSize(s);
                setTrainPage(1);
              }
            },
          }}
        />
      </section>

      {/* Maturity Section */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">
            Digital Maturity Assessment
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isAssessmentEditing) {
                  handleSaveAssessments();
                } else {
                  setIsAssessmentEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isAssessmentEditing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
              }`}
            >
              {isAssessmentEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
            </button>
            {isAssessmentEditing && (
              <button
                onClick={handleCancelAssessments}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => setIsMaturityBulkOpen(true)}
              disabled={isAssessmentEditing}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all ${
                isAssessmentEditing
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              <UploadIcon size={18} />
              Bulk Upload
            </button>
            <button
              onClick={() => {
                setMaturityForm({
                  organizationName: "",
                  activityType: "",
                  totalAssessments: 0,
                  totalImpact: "",
                  paymentType: "FREE",
                  photograph_link: "",
                });
                setIsMaturityModalOpen(true);
              }}
              disabled={isAssessmentEditing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
                isAssessmentEditing
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <Plus size={18} />
              Add Assessment
            </button>
          </div>
        </div>
        <DataTable
          // title={`Digital Maturity Assessment ${isAssessmentEditing ? "(Edit Mode Active)" : ""}`}
          isLoading={isLoading}
          columns={[
            { header: "Sr No.", render: (_, i) => i + 1 },
            {
              header: "Organization",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempAssessments[i]?.organization_name || ""}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "organization_name",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.organization_name || "-"
                ),
            },
            {
              header: "Activity Type",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempAssessments[i]?.activity_type || ""}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "activity_type",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.activity_type || "-"
                ),
            },
            {
              header: "Type",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <select
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempAssessments[i]?.payment_type || "FREE"}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "payment_type",
                        e.target.value,
                      )
                    }
                  >
                    <option value="FREE">FREE</option>
                    <option value="PAID">PAID</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.payment_type === "PAID" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {row.payment_type}
                  </span>
                ),
            },
            {
              header: "Total Assessments",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempAssessments[i]?.total_assessments || ""}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "total_assessments",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                ) : (
                  row.total_assessments || "-"
                ),
            },
            {
              header: "Total Impact",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempAssessments[i]?.total_impact || ""}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "total_impact",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.total_impact || "-"
                ),
            },
            {
              header: "Photograph",
              render: (row, i) =>
                isAssessmentEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Drive URL"
                    value={tempAssessments[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleAssessmentInlineChange(
                        i,
                        "photograph_link",
                        e.target.value,
                      )
                    }
                  />
                ) : row.photograph_link ? (
                  <a
                    href={row.photograph_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Link
                  </a>
                ) : (
                  "-"
                ),
            },
          ]}
          data={assessments}
          // onAdd={() => !isAssessmentEditing && setIsMaturityModalOpen(true)}
          pagination={{
            currentPage: assessPage,
            totalPages: Math.ceil(assessTotal / assessPageSize),
            totalCount: assessTotal,
            pageSize: assessPageSize,
            onPageChange: (p) => !isAssessmentEditing && setAssessPage(p),
            onPageSizeChange: (s) => {
              if (!isAssessmentEditing) {
                setAssessPageSize(s);
                setAssessPage(1);
              }
            },
          }}
        />
      </section>

      {/* Training Modal */}
      <Modal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        title="Add iFactory Training"
      >
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-xs text-green-800">
            Define organization details once, then add multiple attendee records
            below.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.date}
                max={new Date().toISOString().split("T")[0]} // ← add this
                onChange={(e) =>
                  setTrainingForm({ ...trainingForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Organization
              </label>
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.organizationName}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    organizationName: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Photograph Link (Optional)
              </label>
              <input
                type="text"
                placeholder="Google Drive/OneDrive URL"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.photograph_link}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    photograph_link: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-tighter">
                Entries (1-10)
              </label>
              {/* <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.numEntries}
                onChange={(e) =>
                  handleNumEntriesChange(parseInt(e.target.value) || 1)
                }
              /> */}
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.numEntries}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumEntriesChange(e.target.value)}
                onBlur={() => {
                  if (trainingForm.numEntries === "" || trainingForm.numEntries < 1) {
                    handleNumEntriesChange("1");
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.categories}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    categories: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Industrial">Industrial</option>
                <option value="Government">Government</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Industry
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={trainingForm.industryType}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    industryType: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="MSME">MSME</option>
                <option value="OEM">OEM</option>
                <option value="Start-Up">Start-Up</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Attendee Details
            </h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {trainingForm.entries.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Person Name"
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={entry.personName}
                      onChange={(e) =>
                        handleTrainingEntryChange(
                          index,
                          "personName",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      placeholder="Contact No"
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={entry.contactNo}
                      onChange={(e) =>
                        handleTrainingEntryChange(
                          index,
                          "contactNo",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      placeholder="Email ID"
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={entry.emailId}
                      onChange={(e) =>
                        handleTrainingEntryChange(
                          index,
                          "emailId",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      placeholder="Photo URL (Optional)"
                      className="px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                      value={entry.photograph_link}
                      onChange={(e) =>
                        handleTrainingEntryChange(
                          index,
                          "photograph_link",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsTrainingModalOpen(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTrainings}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30"
            >
              Save Training
            </button>
          </div>
        </div>
      </Modal>

      {/* Maturity Modal */}
      <Modal
        isOpen={isMaturityModalOpen}
        onClose={() => setIsMaturityModalOpen(false)}
        title="Digital Maturity Assessment"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              Organization
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={maturityForm.organizationName}
              onChange={(e) =>
                setMaturityForm({
                  ...maturityForm,
                  organizationName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
              Activity Type
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={maturityForm.activityType}
              onChange={(e) =>
                setMaturityForm({
                  ...maturityForm,
                  activityType: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Total Assessments
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={maturityForm.totalAssessments}
                onChange={(e) =>
                  setMaturityForm({
                    ...maturityForm,
                    // totalAssessments: parseInt(e.target.value) || 0,
                    totalAssessments: Math.max(
                      0,
                      parseInt(e.target.value) || 0,
                    ),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Total Impact
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={maturityForm.totalImpact}
                onChange={(e) =>
                  setMaturityForm({
                    ...maturityForm,
                    totalImpact: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Assessment Type
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={maturityForm.paymentType}
                onChange={(e) =>
                  setMaturityForm({
                    ...maturityForm,
                    paymentType: e.target.value,
                  })
                }
              >
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                Photograph Link
              </label>
              <input
                placeholder="Drive URL (Optional)"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={maturityForm.photograph_link}
                onChange={(e) =>
                  setMaturityForm({
                    ...maturityForm,
                    photograph_link: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsMaturityModalOpen(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMaturity}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              Save Assessment
            </button>
          </div>
        </div>
      </Modal>

      {/* Training Bulk Modal */}
      <Modal
        isOpen={isTrainingBulkOpen}
        onClose={() => setIsTrainingBulkOpen(false)}
        title="Training Bulk Upload"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="text-xs text-amber-800">
              <strong>Need a template?</strong> Download our CSV format to
              ensure your data uploads correctly.
            </div>
            <button
              onClick={downloadTrainingTemplate}
              className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-md hover:bg-amber-700 transition-colors font-bold whitespace-nowrap"
            >
              Download Template
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              className="hidden"
              id="training-bulk-input"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <label htmlFor="training-bulk-input" className="cursor-pointer">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-amber-100 text-amber-600">
                <UploadIcon size={24} />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">
                {uploadFile
                  ? uploadFile.name
                  : "Click to select CSV or Excel file"}
              </p>
              <p className="text-xs text-gray-500">CSV or Excel (max 5MB)</p>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsTrainingBulkOpen(false);
                setUploadFile(null);
              }}
              className="px-4 py-2 text-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleTrainingBulkUpload}
              disabled={!uploadFile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              Upload & Process
            </button>
          </div>
        </div>
      </Modal>

      {/* Maturity Bulk Modal */}
      <Modal
        isOpen={isMaturityBulkOpen}
        onClose={() => setIsMaturityBulkOpen(false)}
        title="DMA Bulk Upload"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="text-xs text-amber-800">
              <strong>Need a template?</strong> Download our CSV format to
              ensure your data uploads correctly.
            </div>
            <button
              onClick={downloadMaturityTemplate}
              className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-md hover:bg-amber-700 transition-colors font-bold whitespace-nowrap"
            >
              Download Template
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              className="hidden"
              id="maturity-bulk-input"
              accept=".csv, .xlsx, .xls"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <label htmlFor="maturity-bulk-input" className="cursor-pointer">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-amber-100 text-amber-600">
                <UploadIcon size={24} />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">
                {uploadFile
                  ? uploadFile.name
                  : "Click to select CSV or Excel file"}
              </p>
              <p className="text-xs text-gray-500">CSV or Excel (max 5MB)</p>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsMaturityBulkOpen(false);
                setUploadFile(null);
              }}
              className="px-4 py-2 text-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMaturityBulkUpload}
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

export default DigitalMaturity;
