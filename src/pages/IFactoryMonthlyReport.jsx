// import React, { useState, useEffect } from "react";
// import { Printer, Save, Plus, Trash2 } from "lucide-react";
// // import ifactory from "../assets/images/c4E:iFactory Managment SystemCode\frontendsrcassetsimagesc4i4Logo.png";
// import ifactorylogo from "../assets/images/iFactoryLogo.png";
// import c4i4Logo from "../assets/images/c4i4Logo.png";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";

// const IFactoryMonthlyReport = () => {
//   const getCurrentMonthYear = () => {
//     const now = new Date();
//     return now.toLocaleString("en-US", {
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const { user } = useAuth();
//   const [reportData, setReportData] = useState({
//     // month: "Nov 2025",
//     // totalTrainings: "00",
//     // totalVisitors: "10",
//     // industriesVisited: "08",
//     // educationalInstitutes: "",
//     // totalAssessments: "",
//     // assessmentCompanies: "",
//     // organizationName: "Symbiosis University, Indore",
//     // date: "28 Nov 2025",
//     // signature: "",
//     month: getCurrentMonthYear(), // e.g. "Nov 2025"
//     totalTrainings: "00",
//     totalVisitors: "10",
//     industriesVisited: "08",
//     educationalInstitutes: "",
//     totalAssessments: "",
//     assessmentCompanies: "",
//     organizationName: user?.location ? `${user.location} iFactory Lab` : "Symbiosis University, Indore",
//     date: new Date().toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }), // "28 Nov 2025"
//     signature: "",
//   });

//   const [trainingData, setTrainingData] = useState([
//     {
//       sr: 1,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 2,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 3,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 4,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 5,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 6,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 7,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 8,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 9,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//     {
//       sr: 10,
//       date: "",
//       organization: "",
//       category: "",
//       industry: "",
//       persons: "",
//       contact: "",
//       email: "",
//       about: "",
//     },
//   ]);

//   const [visitorData, setVisitorData] = useState([
//     {
//       sr: 1,
//       date: "03 nov 2025",
//       organization: "Tata Consumer Products Ltd Indore",
//       category: "",
//       industry: "",
//       persons: "Mr. Subrata Bhowmik",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 2,
//       date: "03 nov 2025",
//       organization: "White Cliff Tea Pvt ltd",
//       category: "",
//       industry: "",
//       persons: "Mr. Devajeet Saikia",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 3,
//       date: "03 nov 2025",
//       organization: "QCFI Indore",
//       category: "",
//       industry: "",
//       persons: "Mr. Vivek Mehta",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 4,
//       date: "03 nov 2025",
//       organization: "Tata Consumer Products Ltd Indore",
//       category: "",
//       industry: "",
//       persons: "Mr Romesh Sharma",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 5,
//       date: "03 nov 2025",
//       organization: "Surin Automotive",
//       category: "",
//       industry: "",
//       persons: "Mr. Rajendra Singh",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 6,
//       date: "03 nov 2025",
//       organization: "VE powertrain",
//       category: "",
//       industry: "",
//       persons: "Mr Tushar Korde",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 7,
//       date: "20 Nov 2025",
//       organization: "Yash Technology",
//       category: "",
//       industry: "",
//       persons: "Mr. mahendra Singh Chouhan",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 8,
//       date: "20 Nov 2025",
//       organization: "Yash Technology",
//       category: "",
//       industry: "",
//       persons: "Mr. Amit Sharma",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 9,
//       date: "20 Nov 2025",
//       organization: "ICAR",
//       category: "",
//       industry: "",
//       persons: "Dr. Savita Kolhe",
//       contact: "NA",
//       email: "NA",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//     {
//       sr: 10,
//       date: "27 Nov 2025",
//       organization: "Pinnacle Mobility Solution",
//       category: "",
//       industry: "",
//       persons: "Mr. Shrikant Pandit",
//       contact: "9575300302",
//       email: "shrikant.pandit@ekamobility.com",
//       about: "https://sfsuas-my.sharepoint.com/...",
//     },
//   ]);

//   const [achievements, setAchievements] = useState([
//     { sr: 1, achievement: "" },
//     { sr: 2, achievement: "" },
//   ]);

//   const [feedback, setFeedback] = useState([
//     { sr: 1, name: "", designation: "", organization: "", feedback: "" },
//     { sr: 2, name: "", designation: "", organization: "", feedback: "" },
//   ]);

//   useEffect(() => {
//     const saved = localStorage.getItem("iFactoryMonthlyReport");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setReportData(parsed.reportData || reportData);
//       setTrainingData(parsed.trainingData || trainingData);
//       setVisitorData(parsed.visitorData || visitorData);
//       setAchievements(parsed.achievements || achievements);
//       setFeedback(parsed.feedback || feedback);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMonthlyData();
//   }, [reportData.month]);

//   const fetchMonthlyData = async () => {
//     try {
//       const [trainingsRes, visitorsRes] = await Promise.all([
//         api.get('/training/'),
//         api.get('/visitors/')
//       ]);

//       const trainings = trainingsRes.data.results || trainingsRes.data;
//       const visitors = visitorsRes.data.results || visitorsRes.data;

//       const currentMonthStr = reportData.month;

//       const filteredTrainings = trainings.filter(t => {
//         const d = new Date(t.date);
//         const m = d.toLocaleString("en-US", { month: "long", year: "numeric" });
//         return m === currentMonthStr;
//       });

//       const filteredVisitors = visitors.filter(v => {
//         const d = new Date(v.check_in);
//         const m = d.toLocaleString("en-US", { month: "long", year: "numeric" });
//         return m === currentMonthStr;
//       });

//       // Update Summary
//       setReportData(prev => ({
//         ...prev,
//         totalTrainings: filteredTrainings.length.toString().padStart(2, '0'),
//         totalVisitors: filteredVisitors.length.toString().padStart(2, '0'),
//         industriesVisited: new Set(filteredVisitors.map(v => v.company)).size.toString().padStart(2, '0')
//       }));

//       // Update Tables
//       if (filteredTrainings.length > 0) {
//         setTrainingData(filteredTrainings.map((t, idx) => ({
//           sr: idx + 1,
//           date: new Date(t.date).toLocaleDateString("en-GB"),
//           organization: t.organization_name,
//           category: t.category,
//           industry: t.industry_type,
//           persons: t.person_name,
//           contact: t.phone,
//           email: t.email,
//           about: t.photograph_link || ""
//         })));
//       }

//       if (filteredVisitors.length > 0) {
//         setVisitorData(filteredVisitors.map((v, idx) => ({
//           sr: idx + 1,
//           date: new Date(v.check_in).toLocaleDateString("en-GB"),
//           organization: v.company,
//           category: v.categories,
//           industry: v.industry_type,
//           persons: `${v.first_name} ${v.last_name}`,
//           contact: v.phone,
//           email: v.email,
//           about: v.photograph_link || ""
//         })));
//       }

//     } catch (error) {
//       console.error("Failed to fetch monthly data:", error);
//     }
//   };

//   const handleSave = () => {
//     const data = {
//       reportData,
//       trainingData,
//       visitorData,
//       achievements,
//       feedback,
//       savedAt: new Date().toISOString(),
//     };
//     localStorage.setItem("iFactoryMonthlyReport", JSON.stringify(data));
//     alert("Report saved successfully!");
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const updateTraining = (index, field, value) => {
//     const updated = [...trainingData];
//     updated[index][field] = value;
//     setTrainingData(updated);
//   };

//   const updateVisitor = (index, field, value) => {
//     const updated = [...visitorData];
//     updated[index][field] = value;
//     setVisitorData(updated);
//   };

//   const updateAchievement = (index, value) => {
//     const updated = [...achievements];
//     updated[index].achievement = value;
//     setAchievements(updated);
//   };

//   const updateFeedback = (index, field, value) => {
//     const updated = [...feedback];
//     updated[index][field] = value;
//     setFeedback(updated);
//   };

//   const addAchievement = () => {
//     setAchievements([
//       ...achievements,
//       { sr: achievements.length + 1, achievement: "" },
//     ]);
//   };

//   const addFeedback = () => {
//     setFeedback([
//       ...feedback,
//       {
//         sr: feedback.length + 1,
//         name: "",
//         designation: "",
//         organization: "",
//         feedback: "",
//       },
//     ]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Action Buttons */}
//       <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
//         <button
//           onClick={handleSave}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
//         >
//           <Save size={20} />
//           Save
//         </button>
//         <button
//           onClick={handlePrint}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
//         >
//           <Printer size={20} />
//           Print PDF
//         </button>
//       </div>

//       {/* Report Container */}
//       <div className="max-w-7xl mx-auto p-8 bg-white print:p-4">
//         {/* Header with Logos */}
//         <div className="flex items-center justify-between mb-6">
//           {/* Left Logo - Industry 4.0 */}
//           <div className="flex items-center gap-2">
//             <div className="w-22 h-32 rounded-lg overflow-hidden">
//               <img
//                 src={c4i4Logo}
//                 alt="c4i4Logo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//           {/*
//           <div className="flex items-center gap-2">
//             <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
//               <div className="text-center text-white">
//                 <div className="text-3xl font-bold">i4.0</div>
//                 <div className="text-xs mt-1">INDUSTRY</div>
//               </div>
//             </div>
//           </div> */}

//           {/* Center Title */}
//           <div className="flex-2 text-center">
//             <input
//               type="text"
//               value={reportData.month}
//               onChange={(e) =>
//                 setReportData({ ...reportData, month: e.target.value })
//               }
//               className="text-5xl font-bold text-blue-900 text-center outline-none border-b-2 border-transparent hover:border-blue-300 print:border-none"
//               style={{ width: "400px" }}
//             />
//           </div>

//           {/* Right Logo - iFactory */}
//           <div className="flex items-center gap-2">
//             {/* <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
//               <div className="text-center text-white">
//                 <div className="text-2xl font-bold">iF</div>
//                 <div className="text-xs">FACTORY</div>
//               </div>
//             </div> */}
//             <div className="w-22 h-30 rounded-lg overflow-hidden">
//               <img
//                 src={ifactorylogo}
//                 alt="ifactorylogo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Summary Table */}
//         <div className="mb-6">
//           <table className="w-full border-2 border-gray-800 text-sm">
//             <tbody>
//               <tr className="bg-blue-50">
//                 <td className="border border-gray-800 p-3 font-semibold">
//                   iFactory Training
//                 </td>
//                 <td className="border border-gray-800 p-3"></td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   Total Number of Trainings
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.totalTrainings}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         totalTrainings: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//               </tr>
//               <tr className="bg-blue-50">
//                 <td className="border border-gray-800 p-3 font-semibold">
//                   iFactory Visitors
//                 </td>
//                 <td className="border border-gray-800 p-3"></td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   Total Number of Visitors
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.totalVisitors}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         totalVisitors: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   Industries visited to iFactory Lab
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.industriesVisited}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         industriesVisited: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   Educational Institutes Visited to iFactory Lab
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.educationalInstitutes}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         educationalInstitutes: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//               </tr>
//               <tr className="bg-blue-50">
//                 <td className="border border-gray-800 p-3 font-semibold">
//                   Maturity Assessment
//                 </td>
//                 <td className="border border-gray-800 p-3"></td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   Total Number of Assessment
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.totalAssessments}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         totalAssessments: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Name of Companies Assessment */}
//         <div className="mb-6">
//           <table className="w-full border-2 border-gray-800">
//             <tbody>
//               <tr className="bg-gray-100">
//                 <td className="border border-gray-800 p-3 font-semibold text-center">
//                   Name of Companies Assessment
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   <textarea
//                     value={reportData.assessmentCompanies}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         assessmentCompanies: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none min-h-20"
//                     placeholder="Enter company names..."
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Signature Section */}
//         <div className="mb-8">
//           <table className="w-full border-2 border-gray-800">
//             <tbody>
//               <tr>
//                 <td className="border border-gray-800 p-3 font-semibold w-1/3">
//                   Date
//                 </td>
//                 <td className="border border-gray-800 p-3 font-semibold w-1/3">
//                   Organization Name
//                 </td>
//                 <td className="border border-gray-800 p-3 font-semibold w-1/3">
//                   Seal and Signature
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.date}
//                     onChange={(e) =>
//                       setReportData({ ...reportData, date: e.target.value })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <input
//                     type="text"
//                     value={reportData.organizationName}
//                     onChange={(e) =>
//                       setReportData({
//                         ...reportData,
//                         organizationName: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none print:border-none"
//                   />
//                 </td>
//                 <td className="border border-gray-800 p-3">
//                   <div className="h-16"></div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* iFactory Training Table */}
//         <div className="mb-8 page-break">
//           <h2 className="text-xl font-bold bg-blue-100 p-3 border-2 border-gray-800 mb-0">
//             iFactory Training
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-2 border-gray-800 text-xs">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border border-gray-800 p-2">Sr No.</th>
//                   <th className="border border-gray-800 p-2">Date</th>
//                   <th className="border border-gray-800 p-2">
//                     Organization Name
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Categories
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Industry Type
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Person Name
//                   </th>
//                   <th className="border border-gray-800 p-2">Contact No.</th>
//                   <th className="border border-gray-800 p-2">Email ID</th>
//                   <th className="border border-gray-800 p-2">
//                     Photograph Link
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {trainingData.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="border border-gray-800 p-2 text-center">
//                       {item.sr}.
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.date}
//                         onChange={(e) =>
//                           updateTraining(idx, "date", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.organization}
//                         onChange={(e) =>
//                           updateTraining(idx, "organization", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) =>
//                           updateTraining(idx, "category", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.industry}
//                         onChange={(e) =>
//                           updateTraining(idx, "industry", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.persons}
//                         onChange={(e) =>
//                           updateTraining(idx, "persons", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.contact}
//                         onChange={(e) =>
//                           updateTraining(idx, "contact", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.email}
//                         onChange={(e) =>
//                           updateTraining(idx, "email", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.about}
//                         onChange={(e) =>
//                           updateTraining(idx, "about", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                         placeholder="Google Drive/OneDrive link"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* iFactory Visitor Table */}
//         <div className="mb-8 page-break">
//           <h2 className="text-xl font-bold bg-blue-100 p-3 border-2 border-gray-800 mb-0">
//             iFactory visitor
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border-2 border-gray-800 text-xs">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border border-gray-800 p-2">Sr No.</th>
//                   <th className="border border-gray-800 p-2">Date</th>
//                   <th className="border border-gray-800 p-2">
//                     Organization Name
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Categories
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Industry Type
//                   </th>
//                   <th className="border border-gray-800 p-2">
//                     Person Name
//                   </th>
//                   <th className="border border-gray-800 p-2">Contact No.</th>
//                   <th className="border border-gray-800 p-2">Email ID</th>
//                   <th className="border border-gray-800 p-2">
//                     Photograph Link
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {visitorData.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="border border-gray-800 p-2 text-center">
//                       {item.sr}.
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.date}
//                         onChange={(e) =>
//                           updateVisitor(idx, "date", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.organization}
//                         onChange={(e) =>
//                           updateVisitor(idx, "organization", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) =>
//                           updateVisitor(idx, "category", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.industry}
//                         onChange={(e) =>
//                           updateVisitor(idx, "industry", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.persons}
//                         onChange={(e) =>
//                           updateVisitor(idx, "persons", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.contact}
//                         onChange={(e) =>
//                           updateVisitor(idx, "contact", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.email}
//                         onChange={(e) =>
//                           updateVisitor(idx, "email", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none text-xs"
//                       />
//                     </td>
//                     <td className="border border-gray-800 p-2">
//                       <input
//                         type="text"
//                         value={item.about}
//                         onChange={(e) =>
//                           updateVisitor(idx, "about", e.target.value)
//                         }
//                         className="w-full outline-none print:border-none text-xs"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Key Achievements */}
//         <div className="mb-8 page-break">
//           <h2 className="text-xl font-bold bg-green-100 p-3 border-2 border-gray-800 mb-0">
//             Key Achievements
//           </h2>
//           <table className="w-full border-2 border-gray-800">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-800 p-3 text-left">Sr No.</th>
//                 <th className="border border-gray-800 p-3 text-left">
//                   Monthly Achievements
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {achievements.map((item, idx) => (
//                 <tr key={idx}>
//                   <td className="border border-gray-800 p-3 w-20 text-center">
//                     {item.sr}.
//                   </td>
//                   <td className="border border-gray-800 p-3">
//                     <textarea
//                       value={item.achievement}
//                       onChange={(e) => updateAchievement(idx, e.target.value)}
//                       className="w-full outline-none print:border-none min-h-16"
//                       placeholder="Enter achievement..."
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             onClick={addAchievement}
//             className="no-print mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <Plus size={16} />
//             Add Achievement
//           </button>
//         </div>

//         {/* Feedback */}
//         <div className="mb-8 page-break">
//           <h2 className="text-xl font-bold bg-yellow-100 p-3 border-2 border-gray-800 mb-0">
//             Feedback
//           </h2>
//           <table className="w-full border-2 border-gray-800 text-sm">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-800 p-2">Sr.no</th>
//                 <th className="border border-gray-800 p-2">Name</th>
//                 <th className="border border-gray-800 p-2">Designation</th>
//                 <th className="border border-gray-800 p-2">Organization</th>
//                 <th className="border border-gray-800 p-2">Feedback</th>
//               </tr>
//             </thead>
//             <tbody>
//               {feedback.map((item, idx) => (
//                 <tr key={idx}>
//                   <td className="border border-gray-800 p-2 text-center w-16">
//                     {item.sr}.
//                   </td>
//                   <td className="border border-gray-800 p-2">
//                     <input
//                       type="text"
//                       value={item.name}
//                       onChange={(e) =>
//                         updateFeedback(idx, "name", e.target.value)
//                       }
//                       className="w-full outline-none print:border-none"
//                     />
//                   </td>
//                   <td className="border border-gray-800 p-2">
//                     <input
//                       type="text"
//                       value={item.designation}
//                       onChange={(e) =>
//                         updateFeedback(idx, "designation", e.target.value)
//                       }
//                       className="w-full outline-none print:border-none"
//                     />
//                   </td>
//                   <td className="border border-gray-800 p-2">
//                     <input
//                       type="text"
//                       value={item.organization}
//                       onChange={(e) =>
//                         updateFeedback(idx, "organization", e.target.value)
//                       }
//                       className="w-full outline-none print:border-none"
//                     />
//                   </td>
//                   <td className="border border-gray-800 p-2">
//                     <textarea
//                       value={item.feedback}
//                       onChange={(e) =>
//                         updateFeedback(idx, "feedback", e.target.value)
//                       }
//                       className="w-full outline-none print:border-none min-h-16"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button
//             onClick={addFeedback}
//             className="no-print mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <Plus size={16} />
//             Add Feedback
//           </button>
//         </div>
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
//           }

//           .page-break {
//             page-break-before: always;
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
//         }
//       `}</style>
//     </div>
//   );
// };

// export default IFactoryMonthlyReport;

import React, { useState, useEffect, useRef } from "react";
import { Printer, Save, Plus, Upload, X, Trash2 } from "lucide-react";
import ifactorylogo from "../assets/images/iFactoryLogo.png";
import c4i4Logo from "../assets/images/c4i4Logo.png";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

const IFactoryMonthlyReport = () => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const { user, isSuperAdmin, isAdmin } = useAuth();
  const fileInputRef = useRef(null);
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState(["All Locations"]);

  const [reportData, setReportData] = useState({
    month: getCurrentMonthYear(),
    totalTrainings: "00",
    totalVisitors: "10",
    industriesVisited: "00",
    educationalInstitutes: "00",
    totalAssessments: "00",
    industryTrainings: "00",
    academiaTrainings: "00",
    assessmentCompanies: "",
    organizationName: user?.location
      ? `${user.location} iFactory Lab`
      : "Symbiosis University, Indore",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    signature: "",
  });

  const [trainingData, setTrainingData] = useState([
    {
      sr: 1,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 2,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 3,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 4,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 5,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 6,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 7,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 8,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 9,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
    {
      sr: 10,
      date: "",
      organization: "",
      category: "",
      industry: "",
      persons: "",
      contact: "",
      email: "",
      about: "",
    },
  ]);

  const [visitorData, setVisitorData] = useState([
    {
      sr: 1,
      date: "03 nov 2025",
      organization: "Tata Consumer Products Ltd Indore",
      category: "",
      industry: "",
      persons: "Mr. Subrata Bhowmik",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 2,
      date: "03 nov 2025",
      organization: "White Cliff Tea Pvt ltd",
      category: "",
      industry: "",
      persons: "Mr. Devajeet Saikia",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 3,
      date: "03 nov 2025",
      organization: "QCFI Indore",
      category: "",
      industry: "",
      persons: "Mr. Vivek Mehta",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 4,
      date: "03 nov 2025",
      organization: "Tata Consumer Products Ltd Indore",
      category: "",
      industry: "",
      persons: "Mr Romesh Sharma",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 5,
      date: "03 nov 2025",
      organization: "Surin Automotive",
      category: "",
      industry: "",
      persons: "Mr. Rajendra Singh",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 6,
      date: "03 nov 2025",
      organization: "VE powertrain",
      category: "",
      industry: "",
      persons: "Mr Tushar Korde",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 7,
      date: "20 Nov 2025",
      organization: "Yash Technology",
      category: "",
      industry: "",
      persons: "Mr. mahendra Singh Chouhan",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 8,
      date: "20 Nov 2025",
      organization: "Yash Technology",
      category: "",
      industry: "",
      persons: "Mr. Amit Sharma",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 9,
      date: "20 Nov 2025",
      organization: "ICAR",
      category: "",
      industry: "",
      persons: "Dr. Savita Kolhe",
      contact: "NA",
      email: "NA",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
    {
      sr: 10,
      date: "27 Nov 2025",
      organization: "Pinnacle Mobility Solution",
      category: "",
      industry: "",
      persons: "Mr. Shrikant Pandit",
      contact: "9575300302",
      email: "shrikant.pandit@ekamobility.com",
      about: "https://sfsuas-my.sharepoint.com/...",
    },
  ]);

  const [achievements, setAchievements] = useState([
    { sr: 1, achievement: "" },
    { sr: 2, achievement: "" },
  ]);

  const [feedback, setFeedback] = useState([
    { sr: 1, name: "", designation: "", organization: "", feedback: "" },
    { sr: 2, name: "", designation: "", organization: "", feedback: "" },
  ]);

  // New state for additional uploaded images (separate from PDF images)
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("iFactoryMonthlyReport");
    if (saved) {
      const parsed = JSON.parse(saved);
      setReportData(parsed.reportData || reportData);
      setTrainingData(parsed.trainingData || trainingData);
      setVisitorData(parsed.visitorData || visitorData);
      setAchievements(parsed.achievements || achievements);
      setFeedback(parsed.feedback || feedback);
      if (parsed.uploadedImages) {
        setUploadedImages(parsed.uploadedImages);
      }
    }
  }, []);

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
    fetchMonthlyData();
  }, [reportData.month, filterLocation]);

  const fetchMonthlyData = async () => {
    try {
      const params = { page_size: 10000 };
      if (filterLocation !== "All Locations") {
        params.location = filterLocation;
      }
      const [trainingsRes, visitorsRes, assessmentsRes] = await Promise.all([
        api.get("/training/", { params }),
        api.get("/visitors/", { params }),
        api.get("/training/assessment/", { params }),
      ]);

      const trainings = Array.isArray(trainingsRes.data) ? trainingsRes.data : (trainingsRes.data.results || []);
      const visitors = Array.isArray(visitorsRes.data) ? visitorsRes.data : (visitorsRes.data.results || []);
      const assessments = Array.isArray(assessmentsRes.data) ? assessmentsRes.data : (assessmentsRes.data.results || []);

      const currentMonthStr = reportData.month;

      // Helper to check if a date string falls in the current report month
      const isInCurrentMonth = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        // Robust comparison using month names and years to avoid locale/timezone issues in toLocaleString
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        const m = `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
        const mLocal = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        
        // Check both UTC and Local to be safe against boundary dates (e.g. 1st of month)
        return m.toLowerCase() === currentMonthStr.toLowerCase() || mLocal.toLowerCase() === currentMonthStr.toLowerCase();
      };

      const filteredTrainings = trainings.filter((t) => isInCurrentMonth(t.date));
      const filteredVisitors = visitors.filter((v) => isInCurrentMonth(v.check_in));
      const filteredAssessments = assessments.filter((a) => isInCurrentMonth(a.created_at || a.date));

      const industryTrainings = filteredTrainings.filter(t => {
        const cat = (t.category || '').toLowerCase();
        return cat === 'industry' || cat === 'industrial';
      });
      const academiaTrainings = filteredTrainings.filter(t => {
        const cat = (t.category || '').toLowerCase();
        return cat === 'academia' || cat === 'academic' || cat === 'educational institutes';
      });
      const industryVisitors = filteredVisitors.filter(v => {
        const cat = (v.categories || '').toLowerCase();
        return cat === 'industry' || cat === 'industrial';
      });
      const educationalVisitors = filteredVisitors.filter(v => {
        const cat = (v.categories || '').toLowerCase();
        return cat === 'academia' || cat === 'academic' || cat === 'educational institutes';
      });

      const totalAssessmentsVal = filteredAssessments.reduce((sum, a) => sum + (parseInt(a.total_assessments) || 0), 0);
      const assessmentCompaniesStr = [...new Set(filteredAssessments.map(a => a.organization_name).filter(Boolean))].join(", ");

      setReportData((prev) => ({
        ...prev,
        totalTrainings: filteredTrainings.length.toString().padStart(2, "0"),
        industryTrainings: industryTrainings.length.toString().padStart(2, "0"),
        academiaTrainings: academiaTrainings.length.toString().padStart(2, "0"),
        totalVisitors: filteredVisitors.length.toString().padStart(2, "0"),
        industriesVisited: industryVisitors.length.toString().padStart(2, "0"),
        educationalInstitutes: educationalVisitors.length.toString().padStart(2, "0"),
        totalAssessments: totalAssessmentsVal.toString().padStart(2, "0"),
        assessmentCompanies: assessmentCompaniesStr,
      }));

      // Update Tables with data or reset to empty rows
      const emptyTrainings = Array(10).fill(null).map((_, i) => ({
        sr: i + 1, date: "", organization: "", category: "", industry: "", persons: "", contact: "", email: "", about: ""
      }));
      
      setTrainingData(filteredTrainings.length > 0 ? 
        filteredTrainings.map((t, idx) => ({
          sr: idx + 1,
          date: new Date(t.date).toLocaleDateString("en-GB"),
          organization: t.organization_name,
          category: t.category,
          industry: t.industry_type,
          persons: t.person_name,
          contact: t.phone,
          email: t.email,
          about: t.photograph_link || "",
        })) : emptyTrainings
      );

      const emptyVisitors = Array(10).fill(null).map((_, i) => ({
        sr: i + 1, date: "", organization: "", category: "", industry: "", persons: "", contact: "", email: "", about: ""
      }));

      setVisitorData(filteredVisitors.length > 0 ?
        filteredVisitors.map((v, idx) => ({
          sr: idx + 1,
          date: new Date(v.check_in).toLocaleDateString("en-GB"),
          organization: v.company,
          category: v.categories,
          industry: v.industry_type,
          persons: `${v.first_name} ${v.last_name}`,
          contact: v.phone,
          email: v.email,
          about: v.photograph_link || "",
        })) : emptyVisitors
      );
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  };

  // Image upload handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, "").toUpperCase(),
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (id) => {
    const img = uploadedImages.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const updateImageCaption = (id, caption) => {
    setUploadedImages(
      uploadedImages.map((img) => (img.id === id ? { ...img, caption } : img)),
    );
  };

  const removeAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated.map((item, i) => ({ ...item, sr: i + 1 })));
  };
  const removeFeedback = (index) => {
    const updated = feedback.filter((_, i) => i !== index);
    setFeedback(updated.map((item, i) => ({ ...item, sr: i + 1 })));
  };
  const handleSave = () => {
    const data = {
      reportData,
      trainingData,
      visitorData,
      achievements,
      feedback,
      uploadedImages: uploadedImages.map((img) => ({
        caption: img.caption,
        url: img.url,
      })),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("iFactoryMonthlyReport", JSON.stringify(data));
    notify.success("Report saved successfully!");
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const locationSuffix = filterLocation !== "All Locations" ? ` - ${filterLocation}` : "";
    document.title = `iFactory Monthly Report - ${reportData.month}${locationSuffix}`;
    window.print();
    // Use a timeout to restore title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const updateTraining = (index, field, value) => {
    const updated = [...trainingData];
    updated[index][field] = value;
    setTrainingData(updated);
  };

  const updateVisitor = (index, field, value) => {
    const updated = [...visitorData];
    updated[index][field] = value;
    setVisitorData(updated);
  };

  const updateAchievement = (index, value) => {
    const updated = [...achievements];
    updated[index].achievement = value;
    setAchievements(updated);
  };

  const updateFeedback = (index, field, value) => {
    const updated = [...feedback];
    updated[index][field] = value;
    setFeedback(updated);
  };

  const addAchievement = () => {
    setAchievements([
      ...achievements,
      { sr: achievements.length + 1, achievement: "" },
    ]);
  };

  const addFeedback = () => {
    setFeedback([
      ...feedback,
      {
        sr: feedback.length + 1,
        name: "",
        designation: "",
        organization: "",
        feedback: "",
      },
    ]);
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      options.push(d.toLocaleString("en-US", { month: "long", year: "numeric" }));
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Unified Action Bar */}
      <div className="no-print sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-blue-900 border-r pr-4 mr-2">
              Monthly Report
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
            <div className="flex items-center gap-2">
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
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} />
              Save Progress
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
      <div className="max-w-7xl mx-auto p-8 bg-white print:p-4">
      

        {/* ==================== PAGE 3: HEADER WITH LOGOS ==================== */}
        <div className="page-break">
          {/* Header with Logos */}
          <div className="flex items-center justify-between mb-6">
            {/* Left Logo */}
            <div className="flex items-center gap-2">
              <div className="w-22 h-32 rounded-lg overflow-hidden">
                <img
                  src={c4i4Logo}
                  alt="c4i4Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Title - Just Display, not editable in print now that we have dropdown */}
            <div className="flex-2 text-center px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-900 tracking-tight uppercase">
                {reportData.month}
              </h1>
            </div>

            {/* Right Logo */}
            <div className="flex items-center gap-2">
              <div className="w-22 h-30 rounded-lg overflow-hidden">
                <img
                  src={ifactorylogo}
                  alt="ifactorylogo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-2 border-gray-800 text-sm">
              <tbody>
                <tr className="bg-blue-50">
                  <td className="border border-gray-800 p-3 font-semibold">
                    iFactory Training
                  </td>
                  <td className="border border-gray-800 p-3"></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Total Number of Beneficiaries Trained
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.totalTrainings}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          totalTrainings: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Beneficiaries from Industry
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.industryTrainings}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          industryTrainings: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Beneficiaries from Academia
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.academiaTrainings}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          academiaTrainings: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-800 p-3 font-semibold">
                    iFactory Visitors
                  </td>
                  <td className="border border-gray-800 p-3"></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Total Number of Beneficiaries
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.totalVisitors}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          totalVisitors: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Beneficiaries from Industry
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.industriesVisited}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          industriesVisited: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Beneficiaries from Academia
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.educationalInstitutes}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          educationalInstitutes: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="border border-gray-800 p-3 font-semibold">
                    Digital Maturity Assessment
                  </td>
                  <td className="border border-gray-800 p-3"></td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    Total Number of Assessment
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.totalAssessments}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          totalAssessments: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Name of Companies Assessment */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-2 border-gray-800">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border border-gray-800 p-3 font-semibold text-center">
                    Name of Companies Assessed
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    <textarea
                      value={reportData.assessmentCompanies}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          assessmentCompanies: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none min-h-20"
                      placeholder="Enter company names..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <table className="w-full border-2 border-gray-800">
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-3 font-semibold w-1/3">
                    Date
                  </td>
                  <td className="border border-gray-800 p-3 font-semibold w-1/3">
                    Organization Name
                  </td>
                  <td className="border border-gray-800 p-3 font-semibold w-1/3">
                    Seal and Signature
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.date}
                      onChange={(e) =>
                        setReportData({ ...reportData, date: e.target.value })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-3">
                    <input
                      type="text"
                      value={reportData.organizationName}
                      onChange={(e) =>
                        setReportData({
                          ...reportData,
                          organizationName: e.target.value,
                        })
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-3">
                    <div className="h-16"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== PAGE 4: UPLOADED IMAGES GALLERY ==================== */}
        {/* {(uploadedImages.length > 0 || !window.matchMedia("print").matches) && (
          <div className="mb-8 page-break">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Visit Images Gallery
            </h2>

            {/* Upload Section - Only visible in edit mode */}
        {/* <div className="no-print mb-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                <Upload size={20} />
                Upload Visit Images
              </button>
              <p className="text-sm text-gray-600 mt-2">
                📸 Upload images from lab visits, events, and activities
              </p>
            </div> */}

        {/* Images Grid */}
        {/* {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
                      <img
                        src={img.url}
                        alt={img.caption || "Visit"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="no-print absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) =>
                        updateImageCaption(img.id, e.target.value)
                      }
                      placeholder="Add caption..."
                      className="w-full mt-3 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-semibold text-center uppercase tracking-wide print:border-none"
                    />
                  </div>
                ))}
              </div>
            )} */}

        {/* Empty state for no images */}
        {/* {uploadedImages.length === 0 && (
              <div className="no-print text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">
                  No images uploaded yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Click the button above to add visit images
                </p>
              </div>
            )}
          </div> */}
        {/* )} */}

        {/* iFactory Training Table */}
        <div className="mb-8 page-break">
          <h2 className="text-xl font-bold bg-blue-100 p-3 border-2 border-gray-800 mb-0">
            iFactory Training
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-gray-800 text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-800 p-2">Sr No.</th>
                  <th className="border border-gray-800 p-2">Date</th>
                  <th className="border border-gray-800 p-2">
                    Organization Name
                  </th>
                  <th className="border border-gray-800 p-2">Categories</th>
                  <th className="border border-gray-800 p-2">Industry Type</th>
                  <th className="border border-gray-800 p-2">Person Name</th>
                  <th className="border border-gray-800 p-2">Contact No.</th>
                  <th className="border border-gray-800 p-2">Email ID</th>
                  <th className="border border-gray-800 p-2">
                    Photograph Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainingData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-800 p-2 text-center">
                      {item.sr}.
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) =>
                          updateTraining(idx, "date", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.organization}
                        onChange={(e) =>
                          updateTraining(idx, "organization", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                          updateTraining(idx, "category", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.industry}
                        onChange={(e) =>
                          updateTraining(idx, "industry", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.persons}
                        onChange={(e) =>
                          updateTraining(idx, "persons", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.contact}
                        onChange={(e) =>
                          updateTraining(idx, "contact", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.email}
                        onChange={(e) =>
                          updateTraining(idx, "email", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.about}
                        onChange={(e) =>
                          updateTraining(idx, "about", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                        placeholder="Google Drive/OneDrive link"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* iFactory Visitor Table */}
        <div className="mb-8 page-break">
          <h2 className="text-xl font-bold bg-blue-100 p-3 border-2 border-gray-800 mb-0">
            iFactory Visitor
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-gray-800 text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-800 p-2">Sr No.</th>
                  <th className="border border-gray-800 p-2">Date</th>
                  <th className="border border-gray-800 p-2">
                    Organization Name
                  </th>
                  <th className="border border-gray-800 p-2">Categories</th>
                  <th className="border border-gray-800 p-2">Industry Type</th>
                  <th className="border border-gray-800 p-2">Person Name</th>
                  <th className="border border-gray-800 p-2">Contact No.</th>
                  <th className="border border-gray-800 p-2">Email ID</th>
                  <th className="border border-gray-800 p-2">
                    Photograph Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitorData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-800 p-2 text-center">
                      {item.sr}.
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) =>
                          updateVisitor(idx, "date", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.organization}
                        onChange={(e) =>
                          updateVisitor(idx, "organization", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                          updateVisitor(idx, "category", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.industry}
                        onChange={(e) =>
                          updateVisitor(idx, "industry", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.persons}
                        onChange={(e) =>
                          updateVisitor(idx, "persons", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.contact}
                        onChange={(e) =>
                          updateVisitor(idx, "contact", e.target.value)
                        }
                        className="w-full outline-none print:border-none"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.email}
                        onChange={(e) =>
                          updateVisitor(idx, "email", e.target.value)
                        }
                        className="w-full outline-none print:border-none text-xs"
                      />
                    </td>
                    <td className="border border-gray-800 p-2">
                      <input
                        type="text"
                        value={item.about}
                        onChange={(e) =>
                          updateVisitor(idx, "about", e.target.value)
                        }
                        className="w-full outline-none print:border-none text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-8 page-break overflow-x-auto">
          <h2 className="text-xl font-bold bg-green-100 p-3 border-2 border-gray-800 mb-0">
            Key Achievements
          </h2>
          <table className="w-full border-2 border-gray-800">
            <thead>
              {/* <tr className="bg-gray-200">
                <th className="border border-gray-800 p-3 text-left">Sr No.</th>
                <th className="border border-gray-800 p-3 text-left">
                  Monthly Achievements
                </th>
              </tr> */}
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-3 text-left">Sr No.</th>
                <th className="border border-gray-800 p-3 text-left">
                  Monthly Achievements
                </th>
                <th className="border border-gray-800 p-3 no-print w-12"></th>
              </tr>
            </thead>
            {/* <tbody>
              {achievements.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-3 w-20 text-center">
                    {item.sr}.
                  </td>
                  <td className="border border-gray-800 p-3">
                    <textarea
                      value={item.achievement}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      className="w-full outline-none print:border-none min-h-16"
                      placeholder="Enter achievement..."
                    />
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {achievements.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-3 w-20 text-center">
                    {item.sr}.
                  </td>
                  <td className="border border-gray-800 p-3">
                    <textarea
                      value={item.achievement}
                      onChange={(e) => updateAchievement(idx, e.target.value)}
                      className="w-full outline-none print:border-none min-h-16"
                      placeholder="Enter achievement..."
                    />
                  </td>
                  <td className="border border-gray-800 p-3 w-12 text-center no-print">
                    <button
                      onClick={() => removeAchievement(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      title="Delete row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addAchievement}
            className="no-print mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add Achievement
          </button>
        </div>

        {/* Feedback */}
        <div className="mb-8 page-break overflow-x-auto">
          <h2 className="text-xl font-bold bg-yellow-100 p-3 border-2 border-gray-800 mb-0">
            Feedback
          </h2>
          <table className="w-full border-2 border-gray-800 text-sm">
            <thead>
             
              <tr className="bg-gray-200">
                <th className="border border-gray-800 p-2">Sr.no</th>
                <th className="border border-gray-800 p-2">Name</th>
                <th className="border border-gray-800 p-2">Designation</th>
                <th className="border border-gray-800 p-2">Organization</th>
                <th className="border border-gray-800 p-2">Feedback</th>
                <th className="border border-gray-800 p-2 no-print w-12"></th>
              </tr>
            </thead>
            {/* <tbody>
              {feedback.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-2 text-center w-16">
                    {item.sr}.
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateFeedback(idx, "name", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.designation}
                      onChange={(e) =>
                        updateFeedback(idx, "designation", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) =>
                        updateFeedback(idx, "organization", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <textarea
                      value={item.feedback}
                      onChange={(e) =>
                        updateFeedback(idx, "feedback", e.target.value)
                      }
                      className="w-full outline-none print:border-none min-h-16"
                    />
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody>
              {feedback.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 p-2 text-center w-16">
                    {item.sr}.
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateFeedback(idx, "name", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.designation}
                      onChange={(e) =>
                        updateFeedback(idx, "designation", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) =>
                        updateFeedback(idx, "organization", e.target.value)
                      }
                      className="w-full outline-none print:border-none"
                    />
                  </td>
                  <td className="border border-gray-800 p-2">
                    <textarea
                      value={item.feedback}
                      onChange={(e) =>
                        updateFeedback(idx, "feedback", e.target.value)
                      }
                      className="w-full outline-none print:border-none min-h-16"
                    />
                  </td>
                  <td className="border border-gray-800 p-2 w-12 text-center no-print">
                    <button
                      onClick={() => removeFeedback(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      title="Delete row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addFeedback}
            className="no-print mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add Feedback
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
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
          
          input, select, textarea {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            appearance: none;
            -webkit-appearance: none;
          }
          
          @page {
            margin: 0.5in;
          }

          /* Ensure images print properly */
          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default IFactoryMonthlyReport;


