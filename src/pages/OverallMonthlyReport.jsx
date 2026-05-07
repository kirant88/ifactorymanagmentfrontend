// import React, { useState, useEffect } from "react";
// import { Printer, Save, Download } from "lucide-react";
// import ifactorylogo from "../assets/images/iFactoryLogo.png";
// import c4i4Logo from "../assets/images/c4i4Logo.png";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";

// const OverallMonthlyReport = () => {
//   const { user, isSuperAdmin } = useAuth();
//   const [month, setMonth] = useState(
//     new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
//   );

//   const [locationData, setLocationData] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   // Aggregated stats
//   const [overallStats, setOverallStats] = useState({
//     totalLocations: 0,
//     totalTrainings: 0,
//     totalVisitors: 0,
//     totalAssessments: 0,
//     industriesVisited: new Set(),
//     educationalInstitutes: new Set(),
//   });

//   // Redirect if not super admin
//   useEffect(() => {
//     if (!isSuperAdmin) {
//       window.location.href = "/dashboard";
//     }
//   }, [isSuperAdmin]);

//   // Fetch all data for all locations
//   useEffect(() => {
//     fetchAllLocationData();
//   }, [month]);

//   const fetchAllLocationData = async () => {
//     try {
//       setIsLoading(true);

//       // Fetch all locations first
//       const locationsRes = await api.get("/auth/locations/");
//       const locations = locationsRes.data || [];

//       const params = { page_size: 1000 };
//       const [trainingsRes, visitorsRes, assessmentsRes] = await Promise.all([
//         api.get("/training/", { params }),
//         api.get("/visitors/", { params }),
//         api.get("/training/assessment/", { params }),
//       ]);

//       const trainings = trainingsRes.data.results || trainingsRes.data;
//       const visitors = visitorsRes.data.results || visitorsRes.data;
//       const assessments = assessmentsRes.data.results || assessmentsRes.data;

//       // Filter by current month
//       const filteredTrainings = trainings.filter((t) => {
//         const d = new Date(t.date);
//         const m = d.toLocaleString("en-US", { month: "long", year: "numeric" });
//         return m === month;
//       });

//       const filteredVisitors = visitors.filter((v) => {
//         const d = new Date(v.check_in);
//         const m = d.toLocaleString("en-US", { month: "long", year: "numeric" });
//         return m === month;
//       });

//       const filteredAssessments = assessments.filter((a) => {
//         const d = new Date(a.created_at);
//         const m = d.toLocaleString("en-US", { month: "long", year: "numeric" });
//         return m === month;
//       });

//       // Organize data by location
//       const organized = {};
//       locations.forEach((loc) => {
//         organized[loc] = {
//           location: loc,
//           trainings: filteredTrainings.filter((t) => t.location === loc),
//           visitors: filteredVisitors.filter((v) => v.location === loc),
//           assessments: filteredAssessments.filter((a) => a.location === loc),
//         };
//       });

//       setLocationData(organized);

//       // Calculate aggregated stats
//       const industriesSet = new Set();
//       const institutesSet = new Set();

//       filteredVisitors.forEach((v) => {
//         if (v.company) industriesSet.add(v.company);
//         if (v.categories === "TRAINING") institutesSet.add(v.company);
//       });

//       setOverallStats({
//         totalLocations: locations.length,
//         totalTrainings: filteredTrainings.length,
//         totalVisitors: filteredVisitors.length,
//         totalAssessments: filteredAssessments.length,
//         industriesVisited: industriesSet,
//         educationalInstitutes: institutesSet,
//       });

//       if (!selectedLocation && locations.length > 0) {
//         setSelectedLocation(locations[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSave = () => {
//     const reportData = {
//       month,
//       timestamp: new Date().toISOString(),
//       overallStats: {
//         ...overallStats,
//         industriesVisited: Array.from(overallStats.industriesVisited),
//         educationalInstitutes: Array.from(overallStats.educationalInstitutes),
//       },
//       locationData,
//     };
//     localStorage.setItem("overallMonthlyReport", JSON.stringify(reportData));
//     alert("Report saved successfully!");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const downloadAsJSON = () => {
//     const dataStr = JSON.stringify(locationData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `overall-report-${month.replace(/ /g, "-")}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   if (!isSuperAdmin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-50">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-red-600 mb-4">
//             Access Denied
//           </h1>
//           <p className="text-red-700">
//             Only Super Admins can access this report.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Bar */}
//       <div className="no-print sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-blue-900">
//               Overall Monthly Report
//             </h1>
//             <p className="text-sm text-gray-600">
//               Aggregated data from all locations
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <input
//               type="text"
//               value={month}
//               onChange={(e) => setMonth(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
//             />
//             <button
//               onClick={downloadAsJSON}
//               className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
//             >
//               <Download size={18} />
//               Export JSON
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg"
//             >
//               <Save size={18} />
//               Save
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg"
//             >
//               <Printer size={18} />
//               Print
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto p-8">
//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <p className="mt-4 text-gray-600 font-medium">
//               Loading report data...
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Overall Summary */}
//             <div id="print-section" className="print:p-0">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
//                 {/* Header with Logos */}
//                 <div className="flex items-center justify-between mb-8">
//                   <img
//                     src={c4i4Logo}
//                     alt="C4I4 Logo"
//                     className="h-20 object-contain"
//                   />
//                   <div className="text-center flex-1 mx-8">
//                     <h2 className="text-4xl font-bold text-blue-900 mb-2">
//                       Overall Monthly Report
//                     </h2>
//                     <p className="text-lg text-gray-600">{month}</p>
//                   </div>
//                   <img
//                     src={ifactorylogo}
//                     alt="iFactory Logo"
//                     className="h-20 object-contain"
//                   />
//                 </div>

//                 {/* Summary Stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//                   <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//                     <p className="text-gray-600 font-medium mb-2">
//                       Total Locations
//                     </p>
//                     <p className="text-4xl font-bold text-blue-600">
//                       {overallStats.totalLocations}
//                     </p>
//                   </div>
//                   <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//                     <p className="text-gray-600 font-medium mb-2">
//                       Total Trainings
//                     </p>
//                     <p className="text-4xl font-bold text-green-600">
//                       {overallStats.totalTrainings}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
//                     <p className="text-gray-600 font-medium mb-2">
//                       Total Visitors
//                     </p>
//                     <p className="text-4xl font-bold text-purple-600">
//                       {overallStats.totalVisitors}
//                     </p>
//                   </div>
//                   <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
//                     <p className="text-gray-600 font-medium mb-2">
//                       Total Assessments
//                     </p>
//                     <p className="text-4xl font-bold text-orange-600">
//                       {overallStats.totalAssessments}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Summary Table */}
//                 <table className="w-full border-2 border-gray-800 mb-8">
//                   <tbody>
//                     <tr className="bg-blue-50">
//                       <td className="border border-gray-800 p-4 font-semibold">
//                         Industries Visited
//                       </td>
//                       <td className="border border-gray-800 p-4">
//                         {overallStats.industriesVisited.size}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-800 p-4 font-semibold">
//                         Educational Institutes
//                       </td>
//                       <td className="border border-gray-800 p-4">
//                         {overallStats.educationalInstitutes.size}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Location-wise Data */}
//               {Object.entries(locationData).map(([loc, data]) => (
//                 <div
//                   key={loc}
//                   className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 page-break"
//                 >
//                   <h3 className="text-2xl font-bold text-blue-900 mb-6 pb-4 border-b-2 border-blue-300">
//                     📍 {loc}
//                   </h3>

//                   {/* Location Stats */}
//                   <div className="grid grid-cols-3 gap-4 mb-8">
//                     <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                       <p className="text-sm text-gray-600">Trainings</p>
//                       <p className="text-2xl font-bold text-green-600">
//                         {data.trainings.length}
//                       </p>
//                     </div>
//                     <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//                       <p className="text-sm text-gray-600">Visitors</p>
//                       <p className="text-2xl font-bold text-purple-600">
//                         {data.visitors.length}
//                       </p>
//                     </div>
//                     <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
//                       <p className="text-sm text-gray-600">Assessments</p>
//                       <p className="text-2xl font-bold text-orange-600">
//                         {data.assessments.length}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Trainings Table */}
//                   {data.trainings.length > 0 && (
//                     <div className="mb-8">
//                       <h4 className="text-lg font-bold bg-green-100 p-3 border-2 border-gray-800 mb-0">
//                         Trainings ({data.trainings.length})
//                       </h4>
//                       <div className="overflow-x-auto border-2 border-gray-800 border-t-0">
//                         <table className="w-full text-xs">
//                           <thead>
//                             <tr className="bg-gray-200">
//                               <th className="border border-gray-800 p-2">
//                                 Date
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Organization
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Category
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Industry
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Person
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Contact
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Email
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {data.trainings.map((t, idx) => (
//                               <tr key={idx}>
//                                 <td className="border border-gray-800 p-2">
//                                   {new Date(t.date).toLocaleDateString("en-GB")}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.organization_name}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.category}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.industry_type}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.person_name}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.phone}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {t.email}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}

//                   {/* Visitors Table */}
//                   {data.visitors.length > 0 && (
//                     <div className="mb-8">
//                       <h4 className="text-lg font-bold bg-purple-100 p-3 border-2 border-gray-800 mb-0">
//                         Visitors ({data.visitors.length})
//                       </h4>
//                       <div className="overflow-x-auto border-2 border-gray-800 border-t-0">
//                         <table className="w-full text-xs">
//                           <thead>
//                             <tr className="bg-gray-200">
//                               <th className="border border-gray-800 p-2">
//                                 Date
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Organization
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Category
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Industry
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Person
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Contact
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Email
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {data.visitors.map((v, idx) => (
//                               <tr key={idx}>
//                                 <td className="border border-gray-800 p-2">
//                                   {new Date(v.check_in).toLocaleDateString(
//                                     "en-GB",
//                                   )}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.company}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.categories}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.industry_type}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.first_name} {v.last_name}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.phone}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {v.email}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}

//                   {/* Assessments Table */}
//                   {data.assessments.length > 0 && (
//                     <div className="mb-8">
//                       <h4 className="text-lg font-bold bg-orange-100 p-3 border-2 border-gray-800 mb-0">
//                         Digital Maturity Assessments ({data.assessments.length})
//                       </h4>
//                       <div className="overflow-x-auto border-2 border-gray-800 border-t-0">
//                         <table className="w-full text-xs">
//                           <thead>
//                             <tr className="bg-gray-200">
//                               <th className="border border-gray-800 p-2">
//                                 Organization
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Activity Type
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Type
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Total Count
//                               </th>
//                               <th className="border border-gray-800 p-2">
//                                 Impact
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {data.assessments.map((a, idx) => (
//                               <tr key={idx}>
//                                 <td className="border border-gray-800 p-2">
//                                   {a.organization_name}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {a.activity_type}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   <span
//                                     className={`px-2 py-1 rounded text-[10px] font-bold ${
//                                       a.payment_type === "PAID"
//                                         ? "bg-green-100 text-green-700"
//                                         : "bg-gray-100 text-gray-700"
//                                     }`}
//                                   >
//                                     {a.payment_type}
//                                   </span>
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {a.total_assessments}
//                                 </td>
//                                 <td className="border border-gray-800 p-2">
//                                   {a.total_impact}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}

//                   {/* No Data Message */}
//                   {data.trainings.length === 0 &&
//                     data.visitors.length === 0 &&
//                     data.assessments.length === 0 && (
//                       <div className="text-center py-8 text-gray-500">
//                         <p className="text-lg">
//                           No data for this location in {month}
//                         </p>
//                       </div>
//                     )}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Print Styles */}
//       <style>{`
//         @media print {
//           .no-print {
//             display: none !important;
//           }

//           body {
//             print-color-adjust: exact;
//             -webkit-print-color-adjust: exact;
//             background-color: white;
//           }

//           .page-break {
//             page-break-before: always;
//             page-break-after: auto;
//           }

//           table {
//             page-break-inside: auto;
//           }

//           tr {
//             page-break-inside: avoid;
//             page-break-after: auto;
//           }

//           input, select, textarea {
//             border: none !important;
//             background: transparent !important;
//           }

//           @page {
//             margin: 0.5in;
//           }

//           img {
//             max-width: 100%;
//             height: auto;
//             page-break-inside: avoid;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OverallMonthlyReport;

import React, { useState, useEffect } from "react";
import {
  Printer,
  Save,
  Download,
  MapPin,
  Award,
  TrendingUp,
  Users,
  Building2,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ifactorylogo from "../assets/images/iFactoryLogo.png";
import c4i4Logo from "../assets/images/c4i4Logo.png";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

// ─── Colour palette from the PDF brand ───────────────────────────────────────
const BRAND = {
  blue: "#1565C0",
  blueDark: "#0D47A1",
  blueLight: "#E3F2FD",
  accent: "#29B6F6",
  green: "#2E7D32",
  greenLight: "#E8F5E9",
  purple: "#6A1B9A",
  purpleLight: "#F3E5F5",
  orange: "#E65100",
  orangeLight: "#FFF3E0",
  gray: "#37474F",
  grayLight: "#ECEFF1",
  white: "#FFFFFF",
};

// ─── Performance gauge (arc) ──────────────────────────────────────────────────
const Gauge = ({ value, max = 100, baseline = 49 }) => {
  const pct = Math.min(value / max, 1);
  const r = 40;
  const cx = 56;
  const cy = 56;
  const circumference = Math.PI * r; // half circle
  const offset = circumference * (1 - pct);
  const color = value >= baseline ? "#2E7D32" : "#E65100";

  return (
    <svg width="112" height="68" viewBox="0 0 112 80">
      {/* background arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* value arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* baseline tick */}
      <line
        x1={cx + r * Math.cos(Math.PI * (1 - baseline / max))}
        y1={cy - r * Math.sin(Math.PI * (1 - baseline / max))}
        x2={cx + (r - 14) * Math.cos(Math.PI * (1 - baseline / max))}
        y2={cy - (r - 14) * Math.sin(Math.PI * (1 - baseline / max))}
        stroke="#9E9E9E"
        strokeWidth="2"
      />
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={color}
      >
        {value.toFixed(2)}
      </text>
      <text x={0} y={cy + 20} fontSize="9" fill="#757575">
        0
      </text>
      <text x={cx - 4} y={32} fontSize="9" fill="#757575">
        {baseline}
      </text>
      <text x={104} y={cy + 20} fontSize="9" fill="#757575">
        {max}
      </text>
    </svg>
  );
};

// ─── Donut chart (annual data analysis) ──────────────────────────────────────
const Donut = ({ segments, size = 80 }) => {
  const r = 28;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0)
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="#E0E0E0" />
      </svg>
    );

  let cumAngle = -Math.PI / 2;
  const paths = segments.map((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={seg.color}
      />
    );
  });
  return (
    <svg width={size} height={size}>
      {paths}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
    </svg>
  );
};

// ─── Horizontal bar chart (program summary) ──────────────────────────────────
const HBarChart = ({ data, color, title }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: BRAND.blueDark,
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            gap: 12,
          }}
        >
          <span
            style={{
              width: 52,
              fontSize: 12,
              color: "#616161",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {d.label}
          </span>
          <div
            style={{
              flex: 1,
              background: "#F5F5F5",
              borderRadius: 4,
              height: 22,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(d.value / max) * 100}%`,
                background: color,
                height: "100%",
                borderRadius: 4,
                transition: "width 0.6s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 6,
              }}
            >
              <span style={{ fontSize: 11, color: "white", fontWeight: 700 }}>
                {d.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Location performance card ────────────────────────────────────────────────
const LocationCard = ({ loc, data, selectedMonth, selectedYear }) => {
  const [open, setOpen] = useState(true);
  const [locationImage, setLocationImage] = useState(
    data.glimpsesImage || null,
  );
  const [isLocationUploading, setIsLocationUploading] = useState(false);

  useEffect(() => {
    setLocationImage(data.glimpsesImage || null);
  }, [data.glimpsesImage]);

  const trainings = data.trainings ?? [];
  const visitors = data.visitors ?? [];
  const assessments = data.assessments ?? [];
  const events = data.events ?? [];
  const collaborations = data.collaborations ?? [];

  const discoveryOrgs =
    new Set(visitors.map((v) => v.company).filter(Boolean)).size || 0;
  const discoveryBenes = visitors.length;
  const trainingOrgs =
    new Set(trainings.map((t) => t.organization_name).filter(Boolean)).size ||
    0;
  const trainingBenes = trainings.length;
  const assessmentOrgs =
    new Set(assessments.map((a) => a.organization_name).filter(Boolean)).size ||
    0;
  const assessmentBenes = assessments.length;
  const dmaCompanies =
    data.dmaCompanies ||
    Array.from(
      new Set(assessments.map((a) => a.organization_name).filter(Boolean)),
    );
  const performanceScore =
    data.performanceScore ??
    Math.min(
      100,
      Math.round(
        trainings.length * 2 +
          visitors.length * 0.5 +
          assessments.length * 3 +
          events.length * 2 +
          collaborations.length * 2,
      ),
    );

  const annualSegments = [
    { value: trainings.length, color: BRAND.blue, label: "Trainings" },
    { value: visitors.length, color: BRAND.accent, label: "Visitors" },
    { value: assessments.length, color: BRAND.green, label: "Assessments" },
  ];

  const handleLocationImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsLocationUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      const imageData = {
        month: selectedMonth,
        year: selectedYear,
        image_data: base64Data,
        image_name: file.name,
        location: loc,
      };

      try {
        if (locationImage?.id) {
          const response = await api.patch(
            `/reports/glimpses-month/${locationImage.id}/`,
            imageData,
          );
          setLocationImage(response.data);
        } else {
          const response = await api.post(
            "/reports/glimpses-month/",
            imageData,
          );
          setLocationImage(response.data);
        }
        alert("Location image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading location image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsLocationUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        marginBottom: 32,
        overflow: "hidden",
        pageBreakBefore: "always",
      }}
    >
      {/* Location header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.blueDark} 0%, ${BRAND.blue} 100%)`,
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MapPin size={20} color="white" />
          <h3
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "white",
              letterSpacing: 0.5,
            }}
          >
            {loc}
          </h3>
        </div>
        {open ? (
          <ChevronUp color="white" size={20} />
        ) : (
          <ChevronDown color="white" size={20} />
        )}
      </div>

      {open && (
        <div style={{ padding: "24px 28px" }}>
          {/* Performance dashboard grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr 200px",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {/* Left column: stat rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div
                style={{
                  display: "flex",
                  marginBottom: 2,
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#616161", width: 90 }}>
                  Organizations
                </span>
                <span style={{ fontSize: 12, color: "#616161" }}>
                  Beneficiaries
                </span>
              </div>
              {[
                {
                  label: "i4 Discovery",
                  color: BRAND.blue,
                  orgs: data.discoveryOrgs || discoveryOrgs,
                  benes: data.discoveryBenes || discoveryBenes,
                },
                {
                  label: "Training",
                  color: BRAND.green,
                  orgs: data.trainingOrgs || trainingOrgs,
                  benes: data.trainingBenes || trainingBenes,
                },
                {
                  label: "Assessments",
                  color: BRAND.orange,
                  orgs: data.assessmentOrgs || assessmentOrgs,
                  benes: data.assessmentBenes || assessmentBenes,
                },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      background: BRAND.blue,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      padding: "6px 4px",
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      background: BRAND.grayLight,
                      display: "flex",
                      gap: 2,
                      flex: 1,
                      borderRadius: "0 4px 4px 0",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "white",
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: row.color,
                        }}
                      >
                        {row.orgs}
                      </span>
                    </div>
                    <div
                      style={{
                        background: "white",
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeft: "2px solid #F5F5F5",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: row.color,
                        }}
                      >
                        {row.benes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Performance score gauge */}
              <div
                style={{
                  marginTop: 12,
                  background: BRAND.grayLight,
                  borderRadius: 8,
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#616161",
                    marginBottom: 4,
                  }}
                >
                  Performance Score
                </div>
                <Gauge value={performanceScore} />
              </div>
            </div>

            {/* Centre column: annual data + glimpses */}
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: BRAND.blueDark,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Annual Data Analysis
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#616161",
                    marginBottom: 8,
                  }}
                >
                  Activity Mix
                </div>
                <Donut segments={annualSegments} size={120} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                  textAlign: "center",
                }}
              >
                {annualSegments.map((segment) => (
                  <div key={segment.label}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        display: "inline-block",
                        background: segment.color,
                        marginRight: 8,
                        verticalAlign: "middle",
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#616161" }}>
                      {segment.label}: {segment.value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Glimpses placeholder */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: BRAND.blueDark,
                  marginBottom: 12,
                }}
              >
                Glimpses of the Month
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocationImageUpload}
                  disabled={isLocationUploading}
                  style={{
                    padding: "8px 12px",
                    border: `1.5px solid ${BRAND.blue}`,
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    background: "white",
                  }}
                />
                {isLocationUploading && (
                  <div
                    style={{
                      display: "inline-block",
                      width: 20,
                      height: 20,
                      border: `2px solid ${BRAND.blue}`,
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                )}
              </div>
              {locationImage ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={locationImage.image_data}
                    alt={`Glimpses of the Month - ${loc}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 260,
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      color: "#78909C",
                    }}
                  >
                    {locationImage.image_name}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    border: `2px dashed ${BRAND.gray}`,
                    borderRadius: 12,
                    background: BRAND.grayLight,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: "#78909C",
                    }}
                  >
                    No image uploaded for this location yet.
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 13,
                      color: "#B0BEC5",
                    }}
                  >
                    Upload an image to save location-wise snapshots.
                  </p>
                </div>
              )}
            </div>

            {/* Right column: outreach + DMA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: BRAND.blueDark,
                    marginBottom: 8,
                  }}
                >
                  Outreach Activities
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    {
                      label: "Events",
                      value: data.events.length || 0,
                      color: BRAND.blue,
                    },
                    {
                      label: "Collaborations",
                      value: data.collaborations.length || 0,
                      color: BRAND.accent,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: BRAND.blueLight,
                        borderRadius: 8,
                        padding: "8px 12px",
                        textAlign: "center",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: item.color,
                        }}
                      >
                        {item.value}
                      </div>
                      <div style={{ fontSize: 10, color: "#616161" }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: BRAND.blueDark,
                    marginBottom: 8,
                  }}
                >
                  Digital Maturity Assessment
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#616161",
                    marginBottom: 4,
                  }}
                >
                  List of Companies
                </div>
                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                  {(data.dmaCompanies || []).map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 8px",
                        background: i % 2 === 0 ? "#FAFAFA" : "white",
                        fontSize: 11,
                        color: BRAND.gray,
                        borderBottom: "1px solid #EEEEEE",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                  {(!data.dmaCompanies || data.dmaCompanies.length === 0) && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#BDBDBD",
                        padding: "4px 8px",
                      }}
                    >
                      No assessments this month
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trainings Table */}
          {trainings.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  background: BRAND.greenLight,
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontSize: 14,
                  border: `2px solid ${BRAND.gray}`,
                  borderBottom: "none",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                Trainings ({trainings.length})
              </div>
              <div
                style={{
                  overflowX: "auto",
                  border: `2px solid ${BRAND.gray}`,
                  borderRadius: "0 0 8px 8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 11,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F5F5F5" }}>
                      {[
                        "Date",
                        "Organization",
                        "Category",
                        "Industry",
                        "Person",
                        "Contact",
                        "Email",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            border: "1px solid #BDBDBD",
                            padding: "6px 8px",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trainings.map((t, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 === 0 ? "white" : "#FAFAFA",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {new Date(t.date).toLocaleDateString("en-GB")}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.organization_name}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.category}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.industry_type}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.person_name}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.phone}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {t.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Visitors Table */}
          {/* {(data.visitors || []).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  background: BRAND.purpleLight,
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontSize: 14,
                  border: `2px solid ${BRAND.gray}`,
                  borderBottom: "none",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                Visitors ({data.visitors.length})
              </div>
              <div
                style={{
                  overflowX: "auto",
                  border: `2px solid ${BRAND.gray}`,
                  borderRadius: "0 0 8px 8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 11,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F5F5F5" }}>
                      {[
                        "Date",
                        "Organization",
                        "Category",
                        "Industry",
                        "Person",
                        "Contact",
                        "Email",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            border: "1px solid #BDBDBD",
                            padding: "6px 8px",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.visitors.map((v, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 === 0 ? "white" : "#FAFAFA",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {new Date(v.check_in).toLocaleDateString("en-GB")}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.company}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.categories}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.industry_type}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.first_name} {v.last_name}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.phone}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {v.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Assessments Table */}
          {assessments.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  background: BRAND.orangeLight,
                  padding: "10px 16px",
                  fontWeight: 700,
                  fontSize: 14,
                  border: `2px solid ${BRAND.gray}`,
                  borderBottom: "none",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                Digital Maturity Assessments ({assessments.length})
              </div>
              <div
                style={{
                  overflowX: "auto",
                  border: `2px solid ${BRAND.gray}`,
                  borderRadius: "0 0 8px 8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 11,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#F5F5F5" }}>
                      {[
                        "Organization",
                        "Activity Type",
                        "Type",
                        "Total Count",
                        "Impact",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            border: "1px solid #BDBDBD",
                            padding: "6px 8px",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((a, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 === 0 ? "white" : "#FAFAFA",
                        }}
                      >
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {a.organization_name}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {a.activity_type}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          <span
                            style={{
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              background:
                                a.payment_type === "PAID"
                                  ? BRAND.greenLight
                                  : "#F5F5F5",
                              color:
                                a.payment_type === "PAID"
                                  ? BRAND.green
                                  : "#616161",
                            }}
                          >
                            {a.payment_type}
                          </span>
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {a.total_assessments}
                        </td>
                        <td
                          style={{
                            border: "1px solid #E0E0E0",
                            padding: "5px 8px",
                          }}
                        >
                          {a.total_impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {trainings.length === 0 &&
            (data.visitors || []).length === 0 &&
            assessments.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "#BDBDBD",
                  fontSize: 15,
                }}
              >
                No activity recorded for this location in this period.
              </div>
            )}
        </div>
      )}
    </div>
  );
};

// ─── Main Report Component ────────────────────────────────────────────────────
const OverallMonthlyReport = () => {
  const { user, isSuperAdmin } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [locationData, setLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [glimpsesImage, setGlimpsesImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [overallStats, setOverallStats] = useState({
    totalLocations: 0,
    totalTrainings: 0,
    totalVisitors: 0,
    totalAssessments: 0,
    industriesVisited: new Set(),
    educationalInstitutes: new Set(),
  });

  // Program summary historical data (from PDF)
  const beneficiariesHistory = [
    { label: "Mar 25", value: 1167 },
    { label: "Apr 25", value: 290 },
    { label: "May 25", value: 313 },
    { label: "Jun 25", value: 482 },
    { label: "Jul 25", value: 491 },
    { label: "Aug 25", value: 2435 },
  ];
  const organizationsHistory = [
    { label: "Mar 25", value: 88 },
    { label: "Apr 25", value: 41 },
    { label: "May 25", value: 32 },
    { label: "Jun 25", value: 58 },
    { label: "Jul 25", value: 61 },
    { label: "Aug 25", value: 75 },
  ];

  useEffect(() => {
    if (!isSuperAdmin) window.location.href = "/dashboard";
  }, [isSuperAdmin]);

  useEffect(() => {
    fetchAllLocationData();
    fetchGlimpsesImage();
  }, [selectedMonth, selectedYear]);

  const fetchGlimpsesImage = async () => {
    try {
      const response = await api.get("/reports/glimpses-month/", {
        params: { month: selectedMonth, year: selectedYear },
      });
      if (response.data.length > 0) {
        setGlimpsesImage(response.data[0]);
      } else {
        setGlimpsesImage(null);
      }
    } catch (error) {
      console.error("Error fetching glimpses image:", error);
      setGlimpsesImage(null);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;

        const imageData = {
          month: selectedMonth,
          year: selectedYear,
          image_data: base64Data,
          image_name: file.name,
          location: "All Locations", // Since this is for overall report
        };

        try {
          await api.post("/reports/glimpses-month/", imageData);
          await fetchGlimpsesImage(); // Refresh the image
          alert("Image uploaded successfully!");
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchAllLocationData = async () => {
    try {
      setIsLoading(true);
      const locationsRes = await api.get("/auth/locations/");
      const locations = locationsRes.data || [];
      const params = { page_size: 1000 };
      const [
        trainingsRes,
        visitorsRes,
        assessmentsRes,
        eventsRes,
        collabRes,
        glimpsesRes,
      ] = await Promise.all([
        api.get("/training/", { params }),
        api.get("/visitors/", { params }),
        api.get("/training/assessment/", { params }),
        api.get("/engagement/events/", { params }),
        api.get("/engagement/collaborations/", { params }),
        api.get("/reports/glimpses-month/", {
          params: { ...params, month: selectedMonth, year: selectedYear },
        }),
      ]);
      const trainings = trainingsRes.data.results || trainingsRes.data;
      const visitors = visitorsRes.data.results || visitorsRes.data;
      const assessments = assessmentsRes.data.results || assessmentsRes.data;
      const events = eventsRes.data.results || eventsRes.data;
      const collaborations = collabRes.data.results || collabRes.data;
      const glimpses = glimpsesRes.data.results || glimpsesRes.data || [];

      const filter = (arr, dateField) =>
        arr.filter((item) => {
          const d = new Date(item[dateField]);
          return (
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === selectedYear
          );
        });

      const filteredTrainings = filter(trainings, "date");
      const filteredVisitors = filter(visitors, "check_in");
      const filteredAssessments = filter(assessments, "created_at");
      const filteredEvents = filter(events, "date");
      const filteredCollaborations = filter(collaborations, "start_date");

      const organized = {};
      locations.forEach((loc) => {
        const locTrainings = filteredTrainings.filter(
          (t) => t.location === loc,
        );
        const locVisitors = filteredVisitors.filter((v) => v.location === loc);
        const locAssessments = filteredAssessments.filter(
          (a) => a.location === loc,
        );
        const locEvents = filteredEvents.filter((e) => e.location === loc);
        const locCollaborations = filteredCollaborations.filter(
          (c) => c.location === loc,
        );
        const locGlimpses =
          glimpses.find((item) => item.location === loc) || null;

        organized[loc] = {
          location: loc,
          trainings: locTrainings,
          visitors: locVisitors,
          assessments: locAssessments,
          events: locEvents,
          collaborations: locCollaborations,
          glimpsesImage: locGlimpses,
          dmaCompanies: Array.from(
            new Set(
              locAssessments.map((a) => a.organization_name).filter(Boolean),
            ),
          ),
          performanceScore: Math.min(
            100,
            Math.round(
              locTrainings.length * 2 +
                locVisitors.length * 0.5 +
                locAssessments.length * 3 +
                locEvents.length * 2 +
                locCollaborations.length * 2,
            ),
          ),
        };
      });

      setLocationData(organized);

      const industriesSet = new Set();
      const institutesSet = new Set();
      filteredVisitors.forEach((v) => {
        if (v.company) industriesSet.add(v.company);
        if (v.categories === "TRAINING") institutesSet.add(v.company);
      });

      setOverallStats({
        totalLocations: locations.length,
        totalTrainings: filteredTrainings.length,
        totalVisitors: filteredVisitors.length,
        totalAssessments: filteredAssessments.length,
        industriesVisited: industriesSet,
        educationalInstitutes: institutesSet,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const reportData = {
      month: selectedMonth,
      year: selectedYear,
      timestamp: new Date().toISOString(),
      overallStats: {
        ...overallStats,
        industriesVisited: Array.from(overallStats.industriesVisited),
        educationalInstitutes: Array.from(overallStats.educationalInstitutes),
      },
      locationData,
    };
    localStorage.setItem("overallMonthlyReport", JSON.stringify(reportData));
    alert("Report saved successfully!");
  };

  if (!isSuperAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF3F3",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#C62828" }}>
            Access Denied
          </h1>
          <p style={{ color: "#B71C1C" }}>
            Only Super Admins can access this report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0F4F8",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          borderBottom: `3px solid ${BRAND.blue}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: BRAND.blueDark,
              }}
            >
              i-Factory Network — Overall Monthly Report
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#78909C" }}>
              Aggregated data from all locations
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  padding: "8px 14px",
                  border: `1.5px solid ${BRAND.blue}`,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  outline: "none",
                  color: BRAND.blueDark,
                  background: "white",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  padding: "8px 14px",
                  border: `1.5px solid ${BRAND.blue}`,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  outline: "none",
                  color: BRAND.blueDark,
                  background: "white",
                }}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: BRAND.blue,
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={() => window.print()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: BRAND.green,
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                display: "inline-block",
                width: 48,
                height: 48,
                border: `4px solid ${BRAND.blue}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ marginTop: 16, color: "#78909C", fontWeight: 600 }}>
              Loading report data…
            </p>
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════════════
                PAGE 1 — COVER / OVERALL SUMMARY
            ══════════════════════════════════════════ */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "40px 48px",
                marginBottom: 32,
              }}
            >
              {/* Header with logos */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <img
                  src={c4i4Logo}
                  alt="C4i4 Logo"
                  style={{ height: 72, objectFit: "contain" }}
                />
                <div style={{ textAlign: "center", flex: 1, margin: "0 32px" }}>
                  <h2
                    style={{
                      margin: "0 0 6px",
                      fontSize: 36,
                      fontWeight: 900,
                      color: BRAND.blueDark,
                      letterSpacing: -0.5,
                    }}
                  >
                    i-Factory Network
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 700,
                      color: BRAND.blue,
                    }}
                  >
                    REPORT
                  </p>
                  <p style={{ margin: 0, fontSize: 17, color: "#78909C" }}>
                    {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                      "en-US",
                      { month: "long", year: "numeric" },
                    )}
                  </p>
                </div>
                <img
                  src={ifactorylogo}
                  alt="iFactory Logo"
                  style={{ height: 72, objectFit: "contain" }}
                />
              </div>

              {/* 4 summary KPI cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  marginBottom: 28,
                }}
              >
                {[
                  {
                    label: "Total Locations",
                    value: overallStats.totalLocations,
                    color: BRAND.blue,
                    bg: BRAND.blueLight,
                    Icon: MapPin,
                  },
                  {
                    label: "Total Trainings",
                    value: overallStats.totalTrainings,
                    color: BRAND.green,
                    bg: BRAND.greenLight,
                    Icon: TrendingUp,
                  },
                  {
                    label: "Total Visitors",
                    value: overallStats.totalVisitors,
                    color: BRAND.purple,
                    bg: BRAND.purpleLight,
                    Icon: Users,
                  },
                  {
                    label: "Total Assessments",
                    value: overallStats.totalAssessments,
                    color: BRAND.orange,
                    bg: BRAND.orangeLight,
                    Icon: ClipboardCheck,
                  },
                ].map(({ label, value, color, bg, Icon }) => (
                  <div
                    key={label}
                    style={{
                      background: bg,
                      borderRadius: 12,
                      padding: "20px 24px",
                      border: `1.5px solid ${color}22`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Icon size={18} color={color} />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#616161",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 40,
                        fontWeight: 900,
                        color,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: `2px solid ${BRAND.gray}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <tbody>
                  <tr style={{ background: BRAND.blueLight }}>
                    <td
                      style={{
                        border: `1px solid ${BRAND.gray}`,
                        padding: "14px 18px",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Industries Visited
                    </td>
                    <td
                      style={{
                        border: `1px solid ${BRAND.gray}`,
                        padding: "14px 18px",
                        fontSize: 20,
                        fontWeight: 800,
                        color: BRAND.blue,
                      }}
                    >
                      {overallStats.industriesVisited.size}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: `1px solid ${BRAND.gray}`,
                        padding: "14px 18px",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Educational Institutes
                    </td>
                    <td
                      style={{
                        border: `1px solid ${BRAND.gray}`,
                        padding: "14px 18px",
                        fontSize: 20,
                        fontWeight: 800,
                        color: BRAND.blue,
                      }}
                    >
                      {overallStats.educationalInstitutes.size}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ══════════════════════════════════════════
                GLIMPSES OF THE MONTH
            ══════════════════════════════════════════ */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "36px 48px",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 800,
                    color: BRAND.blueDark,
                  }}
                >
                  Glimpses of the Month
                </h3>
                <div
                  className="no-print"
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    style={{
                      padding: "8px 12px",
                      border: `1.5px solid ${BRAND.blue}`,
                      borderRadius: 8,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  {isUploadingImage && (
                    <div
                      style={{
                        display: "inline-block",
                        width: 20,
                        height: 20,
                        border: `2px solid ${BRAND.blue}`,
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  )}
                </div>
              </div>

              {glimpsesImage ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={glimpsesImage.image_data}
                    alt="Glimpses of the Month"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 400,
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <p style={{ marginTop: 12, fontSize: 14, color: "#78909C" }}>
                    {glimpsesImage.image_name}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    border: `2px dashed ${BRAND.gray}`,
                    borderRadius: 12,
                    background: BRAND.grayLight,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 16, color: "#78909C" }}>
                    No image uploaded for this month
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 14,
                      color: "#B0BEC5",
                    }}
                  >
                    Upload an image to showcase glimpses of the month
                  </p>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════
                PAGE 2 — KEY ACHIEVEMENTS
            ══════════════════════════════════════════ */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "36px 48px",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <Award size={28} color={BRAND.blue} />
                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 900,
                    color: BRAND.blueDark,
                  }}
                >
                  KEY ACHIEVEMENTS
                </h2>
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {[
                  "The iFactory Network Lab at the Islamic University of Science & Technology, Pulwama, Kashmir, was inaugurated on 25th August 2025 by Dr. Jitendra Singh, Hon'ble Union Minister, Government of India.",
                  "The iFactory Lab at Symbiosis University of Applied Sciences, Indore hosted a rollout event on 22nd August 2025 with 1,500+ participants, graced by Shri Shankar Lalwani (Member of Parliament).",
                ].map((text, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: BRAND.blue,
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: BRAND.gray,
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* ══════════════════════════════════════════
                PAGES 3+ — PER-LOCATION SECTIONS
            ══════════════════════════════════════════ */}
            {Object.entries(locationData).map(([loc, data]) => (
              <LocationCard
                key={loc}
                loc={loc}
                data={data}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            ))}

            {/* ══════════════════════════════════════════
                LAST PAGE — PROGRAM SUMMARY
            ══════════════════════════════════════════ */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "36px 48px",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <TrendingUp size={26} color={BRAND.blue} />
                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 900,
                    color: BRAND.blueDark,
                  }}
                >
                  Program Summary
                </h2>
              </div>
              <p
                style={{
                  color: "#546E7A",
                  fontSize: 14,
                  marginBottom: 28,
                  lineHeight: 1.7,
                }}
              >
                As we conclude our efforts in{" "}
                {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
                , we step forward with renewed energy. Our mission is to amplify
                our impact by accelerating the adoption of Industry 4.0 and
                expanding the i-Factory Network across India — driving digital
                transformation, fostering innovation, and ensuring sustained
                growth.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
              >
                <HBarChart
                  data={beneficiariesHistory}
                  color={BRAND.blue}
                  title="Beneficiaries Data"
                />
                <HBarChart
                  data={organizationsHistory}
                  color={BRAND.accent}
                  title="Organizations Data"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Print & animation styles ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; background: white; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
};

export default OverallMonthlyReport;
