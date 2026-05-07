// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from "recharts";
// import { motion } from "framer-motion";

// const data = [
//   { name: "Jan", visitors: 400, training: 240 },
//   { name: "Feb", visitors: 300, training: 139 },
//   { name: "Mar", visitors: 200, training: 980 },
//   { name: "Apr", visitors: 278, training: 390 },
//   { name: "May", visitors: 189, training: 480 },
//   { name: "Jun", visitors: 239, training: 380 },
// ];

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const item = {
//   hidden: { y: 20, opacity: 0 },
//   show: { y: 0, opacity: 1 },
// };

// const Dashboard = () => {
//   return (
//     <motion.div
//       variants={container}
//       initial="hidden"
//       animate="show"
//       className="space-y-6"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           {
//             label: "Total Visitors",
//             value: "1,234",
//             change: "+12%",
//             color: "from-blue-500 to-blue-600",
//           },
//           {
//             label: "Trainings",
//             value: "56",
//             change: "+5%",
//             color: "from-green-500 to-green-600",
//           },
//           {
//             label: "Digital Score",
//             value: "8.4",
//             change: "+0.2",
//             color: "from-purple-500 to-purple-600",
//           },
//           {
//             label: "Events",
//             value: "12",
//             change: "0%",
//             color: "from-orange-500 to-orange-600",
//           },
//         ].map((stat, i) => (
//           <motion.div
//             key={i}
//             variants={item}
//             className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white transform hover:scale-[1.02] transition-transform`}
//           >
//             <h3 className="text-blue-100 text-sm font-medium">{stat.label}</h3>
//             <div className="flex items-end justify-between mt-4">
//               <span className="text-3xl font-bold">{stat.value}</span>
//               <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white font-medium">
//                 {stat.change}
//               </span>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div
//           variants={item}
//           className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
//         >
//           <h3 className="text-lg font-bold mb-6 text-gray-800">
//             Visitor Trends
//           </h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "8px",
//                     border: "none",
//                     boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                   }}
//                 />
//                 <Bar dataKey="visitors" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>

//         <motion.div
//           variants={item}
//           className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
//         >
//           <h3 className="text-lg font-bold mb-6 text-gray-800">
//             Training Completion
//           </h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "8px",
//                     border: "none",
//                     boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="training"
//                   stroke="#10B981"
//                   strokeWidth={3}
//                   dot={{ r: 4, strokeWidth: 2 }}
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Dashboard;

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";


// Static data removed to use realtime API data


const visitorData = [
  { name: "Jan", visitors: 400, training: 240 },
  { name: "Feb", visitors: 300, training: 139 },
  { name: "Mar", visitors: 200, training: 980 },
  { name: "Apr", visitors: 278, training: 390 },
  { name: "May", visitors: 189, training: 480 },
  { name: "Jun", visitors: 239, training: 380 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [visitors, setVisitors] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [events, setEvents] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Safety check: if user is not superadmin but somehow on performance tab, switch to overview
  useEffect(() => {
    if (activeTab === "performance" && !isSuperAdmin) {
      setActiveTab("overview");
    }
  }, [activeTab, isSuperAdmin]);

  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState(["All Locations"]);
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsList = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const params = { page_size: 0 };
        if (filterLocation && filterLocation !== "All Locations") {
          params.location = filterLocation;
        }
        
        const [
          visitorsRes,
          trainingsRes,
          assessmentsRes,
          eventsRes,
          socialMediaRes,
          collabRes,
          maintenanceRes
        ] = await Promise.all([
          api.get("/visitors/", { params }),
          api.get("/training/", { params }),
          api.get("/training/assessment/", { params }),
          api.get("/engagement/events/", { params }),
          api.get("/engagement/social-media/", { params }),
          api.get("/engagement/collaborations/", { params }),
          api.get("/maintenance/", { params })
        ]);

        setVisitors(visitorsRes.data.results || visitorsRes.data || []);
        setTrainings(trainingsRes.data.results || trainingsRes.data || []);
        setAssessments(assessmentsRes.data.results || assessmentsRes.data || []);
        setEvents(eventsRes.data.results || eventsRes.data || []);
        setSocialMedia(socialMediaRes.data.results || socialMediaRes.data || []);
        setCollaborations(collabRes.data.results || collabRes.data || []);
        setMaintenance(maintenanceRes.data.results || maintenanceRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData();
  }, [filterLocation]);


  // Filtering all datasets by location (Double-check fallback for robustness)
  const filterByLocation = (data) => {
    if (filterLocation === "All Locations") return data;
    return data.filter(item => 
      (item.location || '').toLowerCase() === filterLocation.toLowerCase()
    );
  };

  const filteredVisitors = useMemo(() => filterByLocation(visitors), [visitors, filterLocation]);
  const filteredTrainings = useMemo(() => filterByLocation(trainings), [trainings, filterLocation]);
  const filteredAssessments = useMemo(() => filterByLocation(assessments), [assessments, filterLocation]);
  const filteredEvents = useMemo(() => filterByLocation(events), [events, filterLocation]);
  const filteredSocialMedia = useMemo(() => filterByLocation(socialMedia), [socialMedia, filterLocation]);
  const filteredCollaborations = useMemo(() => filterByLocation(collaborations), [collaborations, filterLocation]);
  const filteredMaintenance = useMemo(() => filterByLocation(maintenance), [maintenance, filterLocation]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const resp = await api.get("/auth/locations/");
        const locs = resp.data || [];
        setAvailableLocations(["All Locations", ...locs]);
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Fallback to extraction from visitors if endpoint fails
        const locs = new Set(visitors.map(v => v.location).filter(Boolean));
        setAvailableLocations(["All Locations", ...Array.from(locs)]);
      }
    };
    fetchLocations();
  }, []);

  const locations = availableLocations;

  const processedData = useMemo(() => {
    const orgDataByYear = {};
    const benefDataByYear = {};

    const processItem = (v, dateStr, type) => {
      const date = new Date(dateStr || Date.now());
      const year = date.getFullYear().toString();
      const monthName = allMonths[date.getMonth()];
      const reorderedIdx = monthsList.indexOf(monthName);
      
      const catMap = {
        'industrial': 'Industry',
        'industry': 'Industry',
        'academic': 'Academia',
        'academia': 'Academia',
        'government': 'Government'
      };
      const rawCategory = (v.categories || v.category || '').trim().toLowerCase();
      const category = catMap[rawCategory] || 'Industry';
      const company = v.company || v.organization_name || 'Individual';

      // Organization Counts
      if (!orgDataByYear[year]) {
        orgDataByYear[year] = monthsList.map(m => ({ name: m, count: 0, beneficiariesCount: 0, companies: new Set() }));
      }
      orgDataByYear[year][reorderedIdx].companies.add(company);
      orgDataByYear[year][reorderedIdx].count = orgDataByYear[year][reorderedIdx].companies.size;
      orgDataByYear[year][reorderedIdx].beneficiariesCount += 1;

      // Beneficiary Counts
      if (!benefDataByYear[year]) {
        benefDataByYear[year] = {};
        monthsList.forEach(m => {
          benefDataByYear[year][m] = [
            { name: "Government", value: 0, color: "#60A5FA" },
            { name: "Academia", value: 0, color: "#3B82F6" },
            { name: "Industry", value: 0, color: "#EF4444" },
          ];
        });
      }
      const target = benefDataByYear[year][monthName].find(c => c.name === category);
      if (target) {
        if (type === 'visitor') target.value += 1;
        else if (type === 'training') target.value += 1; // Assuming each record counts as 1 beneficiary for now
      }
    };

    filteredVisitors.forEach(v => processItem(v, v.check_in, 'visitor'));
    filteredTrainings.forEach(t => processItem(t, t.date, 'training'));

    return { orgDataByYear, benefDataByYear };
  }, [filteredVisitors, filteredTrainings]);

  const [orgYear, setOrgYear] = useState(new Date().getFullYear().toString());
  const [benefYear, setBenefYear] = useState(new Date().getFullYear().toString());
  const currentMonthName = allMonths[new Date().getMonth()];
  const [benefMonth, setBenefMonth] = useState(currentMonthName);
  const [pieYear2024, setPieYear2024] = useState(new Date().getFullYear().toString());
  const [pieMonth2024, setPieMonth2024] = useState(currentMonthName);
  const [pieYear2025, setPieYear2025] = useState(new Date().getFullYear().toString());
  const [pieMonth2025, setPieMonth2025] = useState(currentMonthName);


  const performanceData = useMemo(() => {
    const currentMonthIdx = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const isCurrentMonth = (dateStr) => {
      const d = new Date(dateStr);
      return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
    };

    // 1. Visit Stats
    const monthlyVisits = filteredVisitors.filter(v => isCurrentMonth(v.check_in));
    const acadVisits = monthlyVisits.filter(v => (v.categories || '').toLowerCase().includes('academic')).length;
    const indVisits = monthlyVisits.filter(v => (v.categories || '').toLowerCase().includes('industrial')).length;

    // 2. Training Stats
    const monthlyTrainings = filteredTrainings.filter(t => isCurrentMonth(t.date));
    const acadTrainings = monthlyTrainings.filter(t => (t.category || '').toLowerCase().includes('academic')).length;
    const indTrainings = monthlyTrainings.filter(t => (t.category || '').toLowerCase().includes('industrial')).length;

    // 3. Assessment Stats
    const monthlyAssessments = filteredAssessments.filter(a => isCurrentMonth(a.created_at));
    const paidAssessments = monthlyAssessments.filter(a => (a.total_impact || '').toLowerCase().includes('paid')).length;
    const freeAssessments = monthlyAssessments.filter(a => !(a.total_impact || '').toLowerCase().includes('paid')).length;

    // 4. Engagement Stats
    const eventCount = filteredEvents.filter(e => isCurrentMonth(e.date)).length;
    const collabCount = filteredCollaborations.filter(c => isCurrentMonth(c.start_date)).length;
    const socialCount = filteredSocialMedia.filter(s => isCurrentMonth(s.post_date)).length;

    // 5. Maintenance Stats
    const maintenanceCount = filteredMaintenance.filter(m => isCurrentMonth(m.created_at)).length;

    // Scoring Functions
    const calcScore = (value, target, weight) => Math.min(weight, (value / target) * weight) || 0;

    return [
      { category: "Visits", subCategory: "Academic Visit", annual: acadVisits * 12, availPoints: 12, target: 4, monthValue: acadVisits, industry: 0, academia: acadVisits, government: 0, achieved: acadVisits, final: Number(calcScore(acadVisits, 4, 12).toFixed(1)) },
      { category: "Visits", subCategory: "Industry Visit", annual: indVisits * 12, availPoints: 13, target: 8, monthValue: indVisits, industry: indVisits, academia: 0, government: 0, achieved: indVisits, final: Number(calcScore(indVisits, 8, 13).toFixed(1)) },
      { category: "Trainings", subCategory: "Academic Training", annual: acadTrainings * 12, availPoints: 10, target: 2, monthValue: acadTrainings, industry: 0, academia: acadTrainings, government: 0, achieved: acadTrainings, final: Number(calcScore(acadTrainings, 2, 10).toFixed(1)) },
      { category: "Trainings", subCategory: "Industry Training", annual: indTrainings * 12, availPoints: 10, target: 5, monthValue: indTrainings, industry: indTrainings, academia: 0, government: 0, achieved: indTrainings, final: Number(calcScore(indTrainings, 5, 10).toFixed(1)) },
      { category: "Assessments", subCategory: "Assessment Paid", annual: paidAssessments * 12, availPoints: 5, target: 3, monthValue: paidAssessments, industry: paidAssessments, academia: 0, government: 0, achieved: paidAssessments, final: Number(calcScore(paidAssessments, 3, 5).toFixed(1)) },
      { category: "Assessments", subCategory: "Assessment Free", annual: freeAssessments * 12, availPoints: 5, target: 8, monthValue: freeAssessments, industry: freeAssessments, academia: 0, government: 0, achieved: freeAssessments, final: Number(calcScore(freeAssessments, 8, 5).toFixed(1)) },
      { category: "Events", subCategory: "Events", annual: eventCount * 12, availPoints: 5, target: 2, monthValue: eventCount, industry: 0, academia: 0, government: 0, achieved: eventCount, final: Number(calcScore(eventCount, 2, 5).toFixed(1)) },
      { category: "Operational Readiness", subCategory: "Maintenance", annual: maintenanceCount * 12, availPoints: 10, target: 1, monthValue: maintenanceCount, industry: 0, academia: 0, government: 0, achieved: maintenanceCount, final: Number(calcScore(maintenanceCount, 1, 10).toFixed(1)) },
      { category: "Operational Readiness", subCategory: "Social Media", annual: socialCount * 12, availPoints: 10, target: 2, monthValue: socialCount, industry: 0, academia: 0, government: 0, achieved: socialCount, final: Number(calcScore(socialCount, 2, 10).toFixed(1)) },
      { category: "Operational Readiness", subCategory: "Collaborations", annual: collabCount * 12, availPoints: 5, target: 1, monthValue: collabCount, industry: 0, academia: 0, government: 0, achieved: collabCount, final: Number(calcScore(collabCount, 1, 5).toFixed(1)) },
      { category: "Operational Readiness", subCategory: "Specialized Programs", annual: 0, availPoints: 10, target: 1, monthValue: 0, industry: 0, academia: 0, government: 0, achieved: 0, final: 0 },
      { category: "Operational Readiness", subCategory: "Reporting", annual: 12, availPoints: 5, target: 1, monthValue: 1, industry: 0, academia: 0, government: 0, achieved: 1, final: 5 },
    ];
  }, [filteredVisitors, filteredTrainings, filteredAssessments, filteredEvents, filteredSocialMedia, filteredCollaborations, filteredMaintenance]);


  const totalScore = performanceData.reduce((acc, curr) => acc + curr.final, 0).toFixed(1);

  // Consolidating with monthsList defined above


  const getOrgData = () => processedData.orgDataByYear[orgYear] || monthsList.map(m => ({ name: m, count: 0 }));
  const getBeneficiariesData = () => (processedData.benefDataByYear[benefYear] && processedData.benefDataByYear[benefYear][benefMonth]) || [
    { name: "Government", value: 0, color: "#60A5FA" },
    { name: "Academia", value: 0, color: "#3B82F6" },
    { name: "Industry", value: 0, color: "#EF4444" },
  ];
  const getPieData2024 = () => (processedData.benefDataByYear[pieYear2024] && processedData.benefDataByYear[pieYear2024][pieMonth2024]) || [];
  const getPieData2025 = () => (processedData.benefDataByYear[pieYear2025] && processedData.benefDataByYear[pieYear2025][pieMonth2025]) || [];

  const totals = useMemo(() => {
    const totalVisitors = filteredVisitors.length;
    const totalOrgs = new Set(filteredVisitors.map(v => v.company)).size;
    const academic = filteredVisitors.filter(v => (v.categories || '').trim().toLowerCase() === 'academic').length;
    const industrial = filteredVisitors.filter(v => (v.categories || '').trim().toLowerCase() === 'industrial').length;
    const govt = filteredVisitors.filter(v => (v.categories || '').trim().toLowerCase() === 'government').length;
    return { totalVisitors, totalOrgs, academic, industrial, govt };
  }, [filteredVisitors]);


  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${name} ${value}`}
      </text>
    );
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 p-6 bg-gray-50 min-h-screen"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            iFactory Network Lab - Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Analytics and Reporting Overview</p>
        </div>
        {isSuperAdmin && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-gray-500 ml-2">
              Location:
            </span>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border-none bg-transparent font-bold text-blue-600 focus:ring-0 outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "performance"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Performance Matrix
          </button>
        )}
      </div>

      {activeTab === "overview" || !isSuperAdmin ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Visitors",
                value: totals.totalVisitors.toLocaleString(),
                change: "+12%",
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "Unique Organizations",
                value: totals.totalOrgs.toLocaleString(),
                change: "+5%",
                color: "from-green-500 to-green-600",
              },
              {
                label: "Academic Beneficiaries",
                value: totals.academic.toLocaleString(),
                change: "+0.2",
                color: "from-purple-500 to-purple-600",
              },
              {
                label: "Industrial Beneficiaries",
                value: totals.industrial.toLocaleString(),
                change: "0%",
                color: "from-orange-500 to-orange-600",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={item}
                className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white transform hover:scale-[1.02] transition-transform`}
              >
                <h3 className="text-blue-100 text-sm font-medium">
                  {stat.label}
                </h3>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white font-medium">
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Count Graph */}

            <motion.div
              variants={item}
              className="border-2 border-blue-500 rounded-lg p-6 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold bg-yellow-300 px-3 py-1 inline-block">
                  Monthly Organization Count Bar Graph – Year
                </h3>
                <select
                  value={orgYear}
                  onChange={(e) => setOrgYear(e.target.value)}
                  className="px-3 py-1 border-2 border-gray-400 rounded text-sm font-semibold"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getOrgData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      dataKey="count"
                      name="Organization"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="count"
                        position="top"
                        style={{ fontSize: "10px", fontWeight: "bold" }}
                      />
                    </Bar>
                    <Bar
                      dataKey="beneficiariesCount"
                      name="Beneficiaries"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="beneficiariesCount"
                        position="top"
                        style={{ fontSize: "10px", fontWeight: "bold" }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Beneficiaries Count Graph */}
            <motion.div
              variants={item}
              className="border-2 border-green-500 rounded-lg p-6 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold bg-green-400 px-3 py-1 inline-block">
                  Monthly Beneficiaries Count Bar Graph – Year
                </h3>
                <div className="flex gap-2">
                  <select
                    value={benefYear}
                    onChange={(e) => {
                      setBenefYear(e.target.value);
                      setBenefMonth("Dec"); // Fixed default
                    }}
                    className="px-3 py-1 border-2 border-gray-400 rounded text-sm font-semibold"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                  <select
                    value={benefMonth}
                    onChange={(e) => setBenefMonth(e.target.value)}
                    className="px-3 py-1 border-2 border-gray-400 rounded text-sm font-semibold"
                  >
                    {monthsList.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getBeneficiariesData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis style={{ fontSize: "11px" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {getBeneficiariesData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Organization Count Pie Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              variants={item}
              className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-center bg-yellow-300 px-3 py-1 font-bold text-lg rounded">
                  Organization count
                </h4>
                <div className="flex gap-2">
                  <select
                    value={pieYear2025}
                    onChange={(e) => setPieYear2025(e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded text-xs"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                  <select
                    value={pieMonth2025}
                    onChange={(e) => setPieMonth2025(e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded text-xs"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieData2025()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      label={CustomLabel}
                      labelLine={true}
                    >
                      {getPieData2025().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              variants={item}
              className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-center bg-green-400 px-3 py-1 font-bold text-lg rounded">
                  Beneficiaries Count
                </h4>
                <div className="flex gap-2">
                  <select
                    value={pieYear2024}
                    onChange={(e) => setPieYear2024(e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded text-xs"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                  <select
                    value={pieMonth2024}
                    onChange={(e) => setPieMonth2024(e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded text-xs"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieData2024()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      label={CustomLabel}
                      labelLine={true}
                    >
                      {getPieData2024().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div
          variants={item}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Category
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Sub-Category
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Annual Visitors
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase border-r border-gray-200">
                    Avail Points
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase border-r border-gray-200">
                    Target
                  </th>
                  <th className="p-4 text-xs font-bold text-white uppercase bg-blue-600 border-r border-gray-200 text-center">
                    {allMonths[new Date().getMonth()]}
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Industry
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Academia
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Government
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-yellow-100 border-r border-gray-200">
                    Achieved
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase bg-green-500 text-white">
                    Final Point
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {performanceData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-900 border-r border-gray-200">
                      {row.category}
                    </td>
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">
                      {row.subCategory}
                    </td>
                    <td className="p-4 text-sm text-center font-medium border-r border-gray-200">
                      {row.annual}
                    </td>
                    <td className="p-4 text-sm text-center font-medium border-r border-gray-200">
                      {row.availPoints}
                    </td>
                    <td className="p-4 text-sm text-center font-medium border-r border-gray-200">
                      {row.target}
                    </td>
                    <td className="p-4 text-sm text-center font-bold bg-gray-100 border-r border-gray-200">
                      {row.monthValue}
                    </td>
                    <td
                      className={`p-4 text-sm text-center border-r border-gray-200 ${row.industry > 0 ? "bg-yellow-50 font-bold" : ""}`}
                    >
                      {row.industry || ""}
                    </td>
                    <td
                      className={`p-4 text-sm text-center border-r border-gray-200 ${row.academia > 0 ? "bg-yellow-50 font-bold" : ""}`}
                    >
                      {row.academia || ""}
                    </td>
                    <td
                      className={`p-4 text-sm text-center border-r border-gray-200 ${row.government > 0 ? "bg-yellow-50 font-bold" : ""}`}
                    >
                      {row.government || ""}
                    </td>
                    <td className="p-4 text-sm text-center font-bold border-r border-gray-200">
                      {row.achieved}
                    </td>
                    <td className="p-4 text-sm text-center font-bold bg-green-500 text-white">
                      {row.final}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50">
                  <td
                    colSpan={10}
                    className="p-4 text-right font-bold text-lg text-blue-900"
                  >
                    Monthly Total Score
                  </td>
                  <td className="p-4 text-center font-black text-2xl bg-blue-600 text-white border-l-4 border-white">
                    {totalScore}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                Industry Visitors
              </p>
              <p className="text-4xl font-black text-blue-600">
                {totals.industrial}
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                Academia Visitors
              </p>
              <p className="text-4xl font-black text-green-600">
                {totals.academic}
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
                Government Visitors
              </p>
              <p className="text-4xl font-black text-amber-600">
                {totals.govt}
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg border border-blue-400">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">
                Monthly Score
              </p>
              <p className="text-4xl font-black text-white">{totalScore}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
