import React, { useState, useEffect } from "react";
import { Printer, Save, Plus, FileText, CheckCircle, X, Loader2 } from "lucide-react";
import ifactorylogo from "../assets/images/iFactoryLogo.png";
import c4i4Logo from "../assets/images/c4i4Logo.png";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Modal Component
const Modal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-500 text-red-900";
      case "success":
        return "bg-green-50 border-green-500 text-green-900";
      case "warning":
        return "bg-yellow-50 border-yellow-500 text-yellow-900";
      default:
        return "bg-blue-50 border-blue-500 text-blue-900";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200 shadow-xl mx-4">
        <div className={`p-4 border-l-4 ${getTypeStyles()} rounded-t-lg`}>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 whitespace-pre-line">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const Maintenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const { user, isSuperAdmin } = useAuth();
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState(["All Locations"]);

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
    fetchLatestReport();
  }, [filterLocation]);

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const [formData, setFormData] = useState({
    orgName: user?.organization_name || "Symbiosis University, Indore",
    location: user?.location || "Indore",
    date: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    representative: user?.full_name || "John Doe",
    address: user?.location ? `${user.location} Campus` : "Plot No. 12, Industrial Area, Indore",
    completionDate: "",
    signature: "",
  });

  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const [poErrors, setPoErrors] = useState([]);

  const [isVerified, setIsVerified] = useState(false);
  const [showVerifiedError, setShowVerifiedError] = useState(false);

  const [PONumber, setPONumber] = useState([
    { sr: 1, po: "", status: "Completed", issues: "" },
    { sr: 2, po: "", status: "Completed", issues: "" },
  ]);

  const [inspectionData, setInspectionData] = useState([
    {
      category: "Conveyor Assembly Line",
      component: "Roller Bands/Belt",
      details:
        "Check for wear and tear, tension, alignment issues, and material degradation.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Conveyor Assembly Line",
      component: "Conveyor Motors",
      details:
        "Through Visual Inspection check the motor is running properly & Check whether the motor is taking Load or not.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Conveyor Assembly Line",
      component: "Alignment",
      details:
        "Inspect the rollers for alignment issues that could affect the movement of the pallet.(Through Visual Inspection)",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Cobot",
      component: "Joints",
      details:
        "Inspect for smooth movement; check for signs of wear or stiffness.(Through Visual Inspection)",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Cobot",
      component: "Vision System",
      details:
        "Test for camera clarity, focus, and software synchronization.(Through the Process of Assemble the Pumps)",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Cobot",
      component: "Noise Levels",
      details:
        "Measure operating decibels to ensure they are within acceptable limits (by hearing only).",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Cobot",
      component: "Safety Systems",
      details: "Verify emergency stop buttons.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Automated Guided Vehicle (AGV)",
      component: "Battery Health",
      details: "Check charge cycle and runtime.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Automated Guided Vehicle (AGV)",
      component: "Wheels",
      details: "Inspect the wheels for any wear & tear.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Automated Guided Vehicle (AGV)",
      component: "Sensors",
      details:
        "Verify precision and range of sensors (e.g., proximity sensors).",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Automated Guided Vehicle (AGV)",
      component: "AGV Charger",
      details: "Test for consistent charging and inspect cables for damage.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Furniture & Electrical",
      component: "Power Supply",
      details: "Inspect voltage stability, connectivity.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Furniture & Electrical",
      component: "Wiring and Cables",
      details: "Check for exposed wires, loose connections, or short circuits.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Furniture & Electrical",
      component: "Cleanliness",
      details: "Assess and remove dust accumulation in iFactory Lab.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Furniture & Electrical",
      component: "Furniture",
      details: "Check for any damages.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "IT Materials",
      component: "Communication Systems",
      details: "Check the Internet Speed",
      status: "Ok",
      remarks: "",
    },
    {
      category: "IT Materials",
      component: "KIZUNA Software",
      details:
        "1. Check for Extra Login in Shop Planner in Work Force 2. Check for Pending Orders in E-Scheduling",
      status: "Ok",
      remarks: "",
    },
    {
      category: "PLC",
      component: "HMI Display",
      details:
        "Inspect touch sensitivity, display clarity, and operational status.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "PLC",
      component: "PLC Performance",
      details: "Speed & Response time.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Bosch Torque Wrench",
      component: "Andon",
      details: "RPM of the wrench (By Visual), and tool bits.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Bosch Torque Wrench",
      component: "Battery Health",
      details: "Check charge cycle & Runtime.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "General Infrastructure",
      component: "Bolts and Fasteners",
      details:
        "Check tightness, rusting, or damage to critical joints and supports.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "General Infrastructure",
      component: "Bearings",
      details: "Assess lubrication and smooth rotation for all moving parts.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "General Infrastructure",
      component: "Cleanliness",
      details:
        "Inspect for dust, grease, and dirt that could impede operations.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "General Infrastructure",
      component: "Barcode Scanner",
      details: "Check for efficient working and responsiveness.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Start-Up Sequence",
      component: "Full System Check",
      details:
        "Ensure all systems start smoothly without errors or interruptions.",
      status: "Ok",
      remarks: "",
    },
    {
      category: "Shutdown Sequence",
      component: "Full System Check",
      details:
        "Ensure all systems power down smoothly without errors or interruptions.",
      status: "Ok",
      remarks: "",
    },
  ]);

  const [inventoryData, setInventoryData] = useState([
    {
      sr: 1,
      name: "Blue Stator with Terminal Box",
      quantity: 9,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 2,
      name: "Green Stator with Terminal Box",
      quantity: 9,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 3,
      name: "Orange Stator with Terminal Box",
      quantity: 9,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 4,
      name: "Rotor Sub Assembly",
      quantity: 27,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 6,
      name: "M5 x 125 Tie Rod",
      quantity: 81,
      status: "Yes",
      remarks: "",
    },
    { sr: 7, name: "End Plate", quantity: 27, status: "Yes", remarks: "" },
    { sr: 9, name: "Cooling Fan", quantity: 27, status: "Yes", remarks: "" },
    { sr: 10, name: "Grey Fan Cover", quantity: 9, status: "Yes", remarks: "" },
    {
      sr: 11,
      name: "White Fan Cover",
      quantity: 9,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 12,
      name: "Yellow Fan Cover",
      quantity: 9,
      status: "Yes",
      remarks: "",
    },
    { sr: 13, name: "Cotter Pin", quantity: 27, status: "Yes", remarks: "" },
    { sr: 14, name: "Nuts", quantity: 81, status: "Yes", remarks: "" },
    {
      sr: 15,
      name: "Pump Impeller - 60 Dia x 7 mm",
      quantity: 27,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 16,
      name: "M5 x 40 Hex. bolt",
      quantity: 81,
      status: "Yes",
      remarks: "",
    },
    { sr: 17, name: "Volute Casing", quantity: 27, status: "Yes", remarks: "" },
    {
      sr: 18,
      name: "Delivery Flange + Washer",
      quantity: 27,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 19,
      name: "Suction Flange + Non-return Valve",
      quantity: 27,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 20,
      name: "M6 x 20 Hex. bolt",
      quantity: 54,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 21,
      name: "M6 x 25 Hex. bolt",
      quantity: 54,
      status: "Yes",
      remarks: "",
    },
    { sr: 22, name: "Bins", quantity: "79+3", status: "Yes", remarks: "" },
    { sr: 23, name: "Tool Kit", quantity: 1, status: "Yes", remarks: "" },
    { sr: 24, name: "AGV Charger", quantity: 1, status: "Yes", remarks: "" },
    {
      sr: 25,
      name: "Bosch Torque Gun",
      quantity: 2,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 26,
      name: "Bosch Torque Gun Charger",
      quantity: 2,
      status: "Yes",
      remarks: "",
    },
    {
      sr: 27,
      name: "Bosch Torque Gun Battery",
      quantity: 4,
      status: "Yes",
      remarks: "",
    },
    { sr: 28, name: "Trolley", quantity: 3, status: "Yes", remarks: "" },
    {
      sr: 29,
      name: "Digital Muli meter",
      quantity: 1,
      status: "Yes",
      remarks: "",
    },
    { sr: 30, name: "Tachometer", quantity: 1, status: "Yes", remarks: "" },
  ]);

  // Load data from state on mount
  useEffect(() => {
    // Load from session storage draft if exists
    const draft = sessionStorage.getItem("maintenance_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsed.formData }));
        if (parsed.inspectionData) setInspectionData(parsed.inspectionData);
        if (parsed.inventoryData) setInventoryData(parsed.inventoryData);
        if (parsed.PONumber) setPONumber(parsed.PONumber);
        if (parsed.isVerified !== undefined) setIsVerified(parsed.isVerified);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // Auto-save to session storage on change
  useEffect(() => {
    const draft = { formData, inspectionData, inventoryData, PONumber, isVerified };
    sessionStorage.setItem("maintenance_draft", JSON.stringify(draft));
  }, [formData, inspectionData, inventoryData, PONumber, isVerified]);

  const fetchLatestReport = async () => {
    try {
      setIsLoading(true);
      const params = { page_size: 100 };
      if (filterLocation !== "All Locations") {
        params.location = filterLocation;
      }
      const response = await api.get("/maintenance/", { params });
      const reports = response.data.results || response.data;
      if (reports.length > 0) {
        const last = reports[0];
        setFormData({
          orgName: last.organization_name,
          location: last.location,
          date: last.date,
          representative: last.representative,
          address: last.address,
        });
        if (last.report_data) {
          setInspectionData(last.report_data.inspectionData || inspectionData);
          setInventoryData(last.report_data.inventoryData || inventoryData);
          setPONumber(last.report_data.PONumber || PONumber);
          setIsVerified(last.report_data.isVerified || false);
        }
      } else {
        // Reset to default if no report found for this location
        setFormData({
          orgName: user?.organization_name || "",
          location: filterLocation === "All Locations" ? (user?.location || "") : filterLocation,
          date: getCurrentMonthYear(),
          representative: user?.full_name || "",
          address: "",
          completionDate: "",
          signature: "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePONumbers = () => {
    const errors = [];

    PONumber.forEach((item, index) => {
      if (!item.po?.trim() || !item.status?.trim()) {
        errors.push(index);
      }
    });

    setPoErrors(errors);

    if (PONumber.length < 1) { // Relaxed validation to 1 entry for flexibility
      showModal(
        "Incomplete Data",
        "Please fill at least 1 entry in the Assembly Completion Status table.",
        "warning"
      );
      return false;
    }

    if (errors.length > 0) {
      showModal(
        "Missing Information",
        "Please fill all mandatory fields (PO Number) for the rows.",
        "error"
      );
      return false;
    }

    if (!isVerified) {
      setShowVerifiedError(true);
      showModal(
        "Verification Required",
        "Please verify the checklist at the bottom.",
        "warning"
      );
      return false;
    }

    setShowVerifiedError(false);
    return true;
  };

  const handleSave = async () => {
    if (!validatePONumbers()) return;
    
    try {
      setIsLoading(true);
      const data = {
        organization_name: formData.orgName,
        location: formData.location,
        date: formData.date,
        representative: formData.representative,
        address: formData.address,
        report_data: {
          inspectionData,
          inventoryData,
          PONumber,
          isVerified,
        }
      };
      
      await api.post("/maintenance/", data);
      sessionStorage.removeItem("maintenance_draft"); // Clear draft after successful save
      showModal("Success", "Report saved successfully to database! Draft cleared.", "success");
    } catch (error) {
      showModal("Error", "Failed to save report to backend. Keeping draft safe.", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!validatePONumbers()) return;
    window.print();
  };

  const updateInspection = (index, field, value) => {
    const updated = [...inspectionData];
    updated[index][field] = value;
    setInspectionData(updated);
  };

  const updateInventory = (index, field, value) => {
    const updated = [...inventoryData];
    updated[index][field] = value;
    setInventoryData(updated);
  };

  const updatePONumber = (index, field, value) => {
    const updated = [...PONumber];
    updated[index][field] = value;
    setPONumber(updated);
    // remove error highlight once fixed
    if (poErrors.includes(index)) {
      setPoErrors(poErrors.filter((i) => i !== index));
    }
  };

  const addPONumber = () => {
    if (PONumber.length >= 10) return;
    setPONumber([
      ...PONumber,
      {
        sr: PONumber.length + 1,
        po: "",
        status: "Completed",
        issues: "",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* Action Header - Hidden in Print */}
      {/* <div className="no-print max-w-7xl mx-auto p-8 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Factory Maintenance Lab
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            Manage, Save, and Print your Monthly Maintenance Records
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border border-blue-200 rounded-lg text-blue-600 font-bold bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            >
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
            )}
            <span className="font-bold">Save Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Printer
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold">Print PDF</span>
          </button>
        </div>
      </div> */}

      <div className="no-print sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-blue-900 border-r pr-4 mr-2">
              iFactory Maintenance Report
            </h1>

            {/* Location Filter */}
            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Location
                </label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:border-blue-300"
                >
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Month Filter */}
            {/* <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Month
                    </label>
                    <select
                      value={reportData.month}
                      onChange={(e) =>
                        setReportData({ ...reportData, month: e.target.value })
                      }
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:border-blue-300"
                    >
                      {getMonthOptions().map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div> */}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} />
              Save Report
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-blue-200 text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Printer size={18} />
              Print PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Container */}
      <div
        id="print-section"
        className="max-w-7xl mx-auto p-8 bg-white print:p-0 relative"
      >
        {/* Verified Mark (Only visible when printing and verified) */}
        {isVerified && (
          <div className="hidden print:flex fixed top-[20%] right-[10%] flex-col items-center opacity-40 transform rotate-[-35deg] pointer-events-none border-4 border-green-600 p-4 rounded-xl z-[1000] scale-75">
            <CheckCircle size={60} className="text-green-600 mb-2 stroke-[3]" />
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-black text-4xl tracking-[0.2em] uppercase border-t-2 border-green-600 pt-2">
                Verified
              </span>
              <span className="text-green-600 text-lg font-bold mt-1">
                iFACTORY LAB
              </span>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-4">
          <img src={c4i4Logo} alt="C4i4 Logo" className="h-16 object-contain" />
          <h1 className="text-2xl font-bold flex-1 text-center">
            Monthly Maintenance – {getCurrentMonthYear()}
          </h1>
          <img
            src={ifactorylogo}
            alt="iFactory Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Basic Information */}
        <table className="w-full border border-gray-800 mb-6 text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2 font-semibold bg-gray-100 w-1/3">
                Organization Name
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) =>
                    setFormData({ ...formData, orgName: e.target.value })
                  }
                  className="w-full outline-none print:border-none"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2 font-semibold bg-gray-100">
                Location
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full outline-none print:border-none"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2 font-semibold bg-gray-100">
                Date
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full outline-none print:border-none"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2 font-semibold bg-gray-100">
                Industry Partner Representative
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={formData.representative}
                  onChange={(e) =>
                    setFormData({ ...formData, representative: e.target.value })
                  }
                  className="w-full outline-none print:border-none"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2 font-semibold bg-gray-100">
                Site Address
              </td>
              <td className="border border-gray-800 p-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full outline-none print:border-none"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
          <h2 className="font-bold text-lg mb-3 underline">
            Instructions for Monthly Maintenance Report
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Take clear photos of all machines and equipment and share it with
              Report for Reference (Mandatory)
            </li>
            <li>
              Ensure at least 10 pump assemblies are completed during
              maintenance and include the Purchase Order (PO) numbers of these
              pumps in the report.
            </li>
            <li>
              Check all machines to ensure they are rust-free and apply rust
              prevention measures if needed, documenting any rust-related
              issues.
            </li>
            <li>
              Inspect all electrical systems for loose connections, damaged
              wires, or tripped circuits, and take the corrective action.
            </li>
            <li>
              Inspect the AGV's wheels for dirt, wear, or obstructions, clean
              and remove any debris, and report any damage.
            </li>
            <li>
              Record a video of the maintenance process and include it in the
              report for reference.
            </li>
            <li>
              Check for constant voltage supply to the iFactory Lab by
              consulting your organization's electrical team or an external
              electrician and document the findings in the report.
            </li>
          </ol>
        </div>

        {/* Inspection Table */}
        <h2 className="font-bold text-lg mb-3">Inspection Details</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border border-gray-800 text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">Category</th>
                <th className="border border-gray-800 p-2">Component</th>
                <th className="border border-gray-800 p-2">
                  Inspection Details
                </th>
                <th className="border border-gray-800 p-2">Status</th>
                <th className="border border-gray-800 p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {inspectionData.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-2">
                    {item.category}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {item.component}
                  </td>
                  <td className="border border-gray-800 p-2 text-xs">
                    {item.details}
                  </td>
                  <td className="border border-gray-800 p-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateInspection(idx, "status", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    >
                      <option>Ok</option>
                      <option>Not Ok</option>
                    </select>
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        updateInspection(idx, "remarks", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory Table */}
        <h2 className="font-bold text-lg mb-3 mt-8">Inventory Status</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border border-gray-800 text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">Sr. No.</th>
                <th className="border border-gray-800 p-2">SKU Name</th>
                <th className="border border-gray-800 p-2">Quantity</th>
                <th className="border border-gray-800 p-2">Status</th>
                <th className="border border-gray-800 p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-2 text-center">
                    {item.sr}
                  </td>
                  <td className="border border-gray-800 p-2">{item.name}</td>
                  <td className="border border-gray-800 p-2 text-center">
                    {item.quantity}
                  </td>

                  <td className="border border-gray-800 p-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateInventory(idx, "status", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        updateInventory(idx, "remarks", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assembly Completion Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-yellow-100 p-3 border-2 border-gray-800 mb-0">
            Assembly Completion Status
          </h2>
          <table className="w-full border-2 border-gray-800 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">Sr.no</th>
                <th className="border border-gray-800 p-2">PO Number</th>
                <th className="border border-gray-800 p-2">
                  Assembly Completed / Not Completed
                </th>
                <th className="border border-gray-800 p-2">
                  {" "}
                  Issues Found (If any Issues Found)
                </th>
              </tr>
            </thead>

            <tbody>
              {PONumber.map((item, idx) => (
                <tr
                  key={idx}
                  className={
                    poErrors.includes(idx)
                      ? "bg-red-50 border-2 border-red-500"
                      : ""
                  }
                >
                  <td className="border border-gray-800 p-2 text-center">
                    {item.sr}
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.po}
                      onChange={(e) =>
                        updatePONumber(idx, "po", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updatePONumber(idx, "status", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    >
                      <option>Completed</option>
                      <option>Not Completed</option>
                      <option>In Progress</option>
                    </select>
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.issues}
                      onChange={(e) =>
                        updatePONumber(idx, "issues", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addPONumber}
            className={`no-print mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
              PONumber.length >= 10 ? "hidden" : ""
            }`}
          >
            <Plus size={16} />
            Add PO Number
          </button>
        </div>

        {/* Declaration */}
        <div
          className={`mt-8 p-4 bg-gray-50 border rounded ${
            showVerifiedError ? "border-red-500 bg-red-50" : "border-gray-800"
          }`}
        >
          <label className="font-bold mb-4 flex items-center justify-start text-left cursor-pointer">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => {
                setIsVerified(e.target.checked);
                if (e.target.checked) setShowVerifiedError(false);
              }}
              className="w-6 h-6 mr-3 border-2 border-gray-800"
            />
            This is Clarified that We have Completed the Monthly Maintenance of
            iFactory Lab on
          </label>
        </div>

        {/* Thank You */}
        <div className="text-center mt-8 mb-4">
          <h2 className="text-2xl font-bold">Thank You</h2>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          #print-section, #print-section * {
            visibility: visible;
          }
          
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: white !important;
            z-index: 9999;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background-color: white;
            overflow: visible;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          input, select {
            border: none !important;
            background: transparent !important;
          }
          
          select {
             appearance: none;
             -webkit-appearance: none;
             -moz-appearance: none;
             border: none;
          }

          .print-header-small {
            font-size: 10px;
            color: #666;
            text-align: right;
            margin-bottom: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Maintenance;
