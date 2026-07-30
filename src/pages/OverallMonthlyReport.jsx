import React, { useState, useEffect, useCallback } from "react";
import { Printer, Save, Plus, Trash2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ReportPage, { SectionTitle } from "../components/report/ReportPage";
import CoverPage from "../components/report/CoverPage";
import ContentsPage from "../components/report/ContentsPage";
import NetworkPage from "../components/report/NetworkPage";
import { CollagePage } from "../components/report/CollageGrid";
import CollageManager from "../components/report/CollageManager";
import LocationDashboard from "../components/report/LocationDashboard";
import { HBarChart } from "../components/report/LocationDashboard";
import {
  BRAND,
  DEFAULT_KEY_ACHIEVEMENTS,
  DEFAULT_PROGRAM_SUMMARY,
  OUR_FOCUS_ITEMS,
  BENEFICIARIES_ITEMS,
  TRAINING_DESCRIPTION,
  CONTACT_LOCATIONS,
  HEAD_OFFICE,
  LINKEDIN_QR,
  CONTACT_FOOTER_LOGOS,
  OUR_FOCUS_BADGES,
  BENEFICIARIES_HISTORY,
  ORGANIZATIONS_HISTORY,
  SECTION_TYPES,
  formatMonthYear,
} from "../constants/reportConstants";

const chunkCollagePages = (groups, perPage = 2) => {
  const pages = [];
  for (let i = 0; i < groups.length; i += perPage) {
    pages.push(groups.slice(i, i + perPage));
  }
  return pages.length ? pages : [[]];
};

const OverallMonthlyReport = () => {
  const { isSuperAdmin } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [locationData, setLocationData] = useState({});
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyAchievements, setKeyAchievements] = useState(DEFAULT_KEY_ACHIEVEMENTS);
  const [programSummary, setProgramSummary] = useState("");
  const [achievementCollages, setAchievementCollages] = useState([]);
  const [locationCollages, setLocationCollages] = useState({});
  const [newAchievement, setNewAchievement] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  const monthYear = formatMonthYear(selectedMonth, selectedYear);

  useEffect(() => {
    if (!isSuperAdmin) window.location.href = "/dashboard";
  }, [isSuperAdmin]);

  const fetchCollages = useCallback(async () => {
    try {
      const [achRes, ...locResponses] = await Promise.all([
        api.get("/reports/collage-groups/", {
          params: {
            month: selectedMonth,
            year: selectedYear,
            section_type: SECTION_TYPES.KEY_ACHIEVEMENTS,
          },
        }),
        ...(locations.length
          ? locations.map((loc) =>
              api.get("/reports/collage-groups/", {
                params: {
                  month: selectedMonth,
                  year: selectedYear,
                  section_type: SECTION_TYPES.LOCATION,
                  location: loc,
                },
              }),
            )
          : []),
      ]);

      setAchievementCollages(achRes.data.results || achRes.data || []);

      const locMap = {};
      locations.forEach((loc, idx) => {
        const res = locResponses[idx];
        locMap[loc] = res?.data?.results || res?.data || [];
      });
      setLocationCollages(locMap);
    } catch (err) {
      console.error("Error fetching collages:", err);
    }
  }, [selectedMonth, selectedYear, locations]);

  const fetchReportContent = useCallback(async () => {
    try {
      const res = await api.get("/reports/monthly-content/", {
        params: { month: selectedMonth, year: selectedYear },
      });
      const data = res.data;
      if (data.key_achievements?.length) {
        setKeyAchievements(data.key_achievements);
      } else {
        setKeyAchievements(DEFAULT_KEY_ACHIEVEMENTS);
      }
      setProgramSummary(
        data.program_summary ||
          DEFAULT_PROGRAM_SUMMARY.replace("{monthYear}", monthYear),
      );
    } catch (err) {
      console.error("Error fetching report content:", err);
      setKeyAchievements(DEFAULT_KEY_ACHIEVEMENTS);
      setProgramSummary(DEFAULT_PROGRAM_SUMMARY.replace("{monthYear}", monthYear));
    }
  }, [selectedMonth, selectedYear, monthYear]);

  const fetchAllLocationData = useCallback(async () => {
    try {
      setIsLoading(true);
      const locationsRes = await api.get("/auth/locations/");
      const locs = locationsRes.data || [];
      setLocations(locs);

      const params = { page_size: 1000 };
      const [trainingsRes, visitorsRes, assessmentsRes, eventsRes, collabRes] =
        await Promise.all([
          api.get("/training/", { params }),
          api.get("/visitors/", { params }),
          api.get("/training/assessment/", { params }),
          api.get("/engagement/events/", { params }),
          api.get("/engagement/collaborations/", { params }),
        ]);

      const filter = (arr, dateField) =>
        (arr.results || arr).filter((item) => {
          const d = new Date(item[dateField]);
          return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
        });

      const filteredTrainings = filter(trainingsRes.data, "date");
      const filteredVisitors = filter(visitorsRes.data, "check_in");
      const filteredAssessments = filter(assessmentsRes.data, "created_at");
      const filteredEvents = filter(eventsRes.data, "date");
      const filteredCollaborations = filter(collabRes.data, "start_date");

      const organized = {};
      locs.forEach((loc) => {
        const locTrainings = filteredTrainings.filter((t) => t.location === loc);
        const locVisitors = filteredVisitors.filter((v) => v.location === loc);
        const locAssessments = filteredAssessments.filter((a) => a.location === loc);
        const locEvents = filteredEvents.filter((e) => e.location === loc);
        const locCollaborations = filteredCollaborations.filter((c) => c.location === loc);

        organized[loc] = {
          location: loc,
          trainings: locTrainings,
          visitors: locVisitors,
          assessments: locAssessments,
          events: locEvents,
          collaborations: locCollaborations,
          dmaCompanies: Array.from(
            new Set(locAssessments.map((a) => a.organization_name).filter(Boolean)),
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
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAllLocationData();
    fetchReportContent();
  }, [fetchAllLocationData, fetchReportContent]);

  useEffect(() => {
    if (locations.length) fetchCollages();
  }, [locations, fetchCollages]);

  const saveReportContent = async () => {
    setIsSavingContent(true);
    try {
      await api.put("/reports/monthly-content/", {
        month: selectedMonth,
        year: selectedYear,
        key_achievements: keyAchievements,
        program_summary: programSummary,
      });
      alert("Report content saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save report content.");
    } finally {
      setIsSavingContent(false);
    }
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setKeyAchievements((prev) => [...prev, newAchievement.trim()]);
    setNewAchievement("");
  };

  const removeAchievement = (idx) => {
    setKeyAchievements((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateAchievement = (idx, value) => {
    setKeyAchievements((prev) => prev.map((item, i) => (i === idx ? value : item)));
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#C62828" }}>Access Denied</h1>
          <p>Only Super Admins can access this report.</p>
        </div>
      </div>
    );
  }

  const achievementPages = chunkCollagePages(achievementCollages, 2);

  const pageNos = (() => {
    let n = 0;
    const next = () => ++n;
    const nums = {
      network: next(),
      ourFocus: next(),
      keyAchievements: next(),
      achievementGlimpses: achievementPages.map(() => next()),
      locations: {},
      programSummary: null,
      contact: null,
    };
    locations.forEach((loc) => {
      const locPages = chunkCollagePages(locationCollages[loc] || [], 2);
      nums.locations[loc] = {
        dashboard: next(),
        glimpses: locPages.map(() => next()),
      };
    });
    nums.programSummary = next();
    nums.contact = next();
    return nums;
  })();

  return (
    <div style={{ minHeight: "100vh", background: "#ECEFF1", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
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
            maxWidth: 960,
            margin: "0 auto",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BRAND.blueDark }}>
              i-Factory Network — Monthly Report
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#78909C" }}>
              Standard report matching PDF layout
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${BRAND.blue}`, fontWeight: 700 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${BRAND.blue}`, fontWeight: 700 }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
            <button
              onClick={saveReportContent}
              disabled={isSavingContent}
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
              <Save size={16} /> Save Content
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
              <Printer size={16} /> Print / PDF
            </button>
          </div>
        </div>
      </div>

      <div id="print-section" style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#78909C" }}>Loading report…</div>
        ) : (
          <>
            <CoverPage monthYear={monthYear} />
            <ContentsPage locations={locations} />
            <NetworkPage pageNumber={pageNos.network} />

            <ReportPage pageNumber={pageNos.ourFocus}>
              <SectionTitle>OUR FOCUS</SectionTitle>
              <ul style={{ margin: "0 0 32px", paddingLeft: 20, lineHeight: 1.8, color: BRAND.gray }}>
                {OUR_FOCUS_ITEMS.map((item, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>{item}</li>
                ))}
              </ul>
              <SectionTitle style={{ marginTop: 28 }}>Beneficiaries</SectionTitle>
              <ul style={{ margin: "0 0 32px", paddingLeft: 20, lineHeight: 1.8, color: BRAND.gray }}>
                {BENEFICIARIES_ITEMS.map((item, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>{item}</li>
                ))}
              </ul>
              <SectionTitle style={{ marginTop: 28 }}>Industry 4.0 Hands-on Training</SectionTitle>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: BRAND.gray, margin: "0 0 36px" }}>
                {TRAINING_DESCRIPTION}
              </p>

              {/* PDF page 02: circular brand badges */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 36,
                  marginTop: "auto",
                  paddingTop: 12,
                  flexWrap: "wrap",
                }}
              >
                {OUR_FOCUS_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: "0 2px 10px rgba(21, 101, 192, 0.14)",
                      border: "1px solid #E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 14,
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={badge.src}
                      alt={badge.label}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
              </div>
            </ReportPage>

            <ReportPage pageNumber={pageNos.keyAchievements}>
              <SectionTitle>KEY ACHIEVEMENTS</SectionTitle>
              <div className="no-print" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <textarea
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add new achievement..."
                    rows={2}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 8,
                      border: `1.5px solid ${BRAND.blue}`,
                      fontSize: 14,
                    }}
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    style={{
                      padding: "10px 16px",
                      background: BRAND.blue,
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {keyAchievements.map((text, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      marginBottom: 18,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: BRAND.blue,
                        flexShrink: 0,
                        marginTop: 7,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <textarea
                        className="no-print"
                        value={text}
                        onChange={(e) => updateAchievement(i, e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          border: "1px solid #E0E0E0",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: BRAND.gray,
                        }}
                      />
                      <p
                        className="print-only"
                        style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: BRAND.gray }}
                      >
                        {text}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="no-print"
                      onClick={() => removeAchievement(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#C62828",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </ReportPage>

            <div className="no-print">
              <CollageManager
                title="Key Achievements — Glimpses (upload collages)"
                sectionType={SECTION_TYPES.KEY_ACHIEVEMENTS}
                month={selectedMonth}
                year={selectedYear}
                groups={achievementCollages}
                onRefresh={fetchCollages}
              />
            </div>

            {achievementPages.map((pageGroups, pageIdx) => (
              <ReportPage key={`ach-${pageIdx}`} pageNumber={pageNos.achievementGlimpses[pageIdx]}>
                {pageIdx === 0 && <SectionTitle>Key Achievements - Glimpses</SectionTitle>}
                <CollagePage groups={pageGroups} />
                {pageGroups.length === 0 && pageIdx === 0 && (
                  <p style={{ textAlign: "center", color: "#B0BEC5", padding: 40 }}>
                    No glimpse collages uploaded for this month.
                  </p>
                )}
              </ReportPage>
            ))}

            {locations.map((loc) => {
              const data = locationData[loc] || {};
              const collages = locationCollages[loc] || [];
              const locPages = chunkCollagePages(collages, 2);

              return (
                <React.Fragment key={loc}>
                  <div className="no-print">
                    <CollageManager
                      title={`${loc} — Location Glimpses`}
                      sectionType={SECTION_TYPES.LOCATION}
                      location={loc}
                      month={selectedMonth}
                      year={selectedYear}
                      groups={collages}
                      onRefresh={fetchCollages}
                    />
                  </div>

                  <ReportPage className="location-dashboard-page" pageNumber={pageNos.locations[loc].dashboard}>
                    <LocationDashboard loc={loc} data={data} monthYear={monthYear} />
                  </ReportPage>

                  {locPages.map((pageGroups, pageIdx) => (
                    <ReportPage key={`${loc}-${pageIdx}`} pageNumber={pageNos.locations[loc].glimpses[pageIdx]}>
                      {pageIdx === 0 && (
                        <h2
                          style={{
                            margin: "0 0 20px",
                            fontSize: 24,
                            fontWeight: 800,
                            color: BRAND.blue,
                          }}
                        >
                          i-Factory Network, {loc}
                        </h2>
                      )}
                      <CollagePage groups={pageGroups} />
                      {pageGroups.length === 0 && pageIdx === 0 && (
                        <p style={{ textAlign: "center", color: "#B0BEC5", padding: 32 }}>
                          No location glimpses uploaded.
                        </p>
                      )}
                    </ReportPage>
                  ))}
                </React.Fragment>
              );
            })}

            <ReportPage pageNumber={pageNos.programSummary}>
              <SectionTitle>Program Summary</SectionTitle>
              <textarea
                className="no-print"
                value={programSummary}
                onChange={(e) => setProgramSummary(e.target.value)}
                rows={5}
                style={{
                  width: "100%",
                  border: "1px solid #E0E0E0",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#546E7A",
                  marginBottom: 28,
                }}
              />
              <p
                className="print-only"
                style={{ color: "#546E7A", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}
              >
                {programSummary}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <HBarChart data={BENEFICIARIES_HISTORY} color={BRAND.blue} title="Beneficiaries Data" />
                <HBarChart data={ORGANIZATIONS_HISTORY} color={BRAND.accent} title="Organizations Data" />
              </div>
            </ReportPage>

            <ReportPage className="contact-page" pageNumber={pageNos.contact}>
              <SectionTitle>Contact Us</SectionTitle>
              <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
                {CONTACT_LOCATIONS.map((contact) => (
                  <div
                    key={contact.city}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "110px 1fr",
                      gap: 14,
                      alignItems: "center",
                      paddingBottom: 8,
                      borderBottom: "1px solid #ECEFF1",
                    }}
                  >
                    <div
                      style={{
                        width: 110,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={contact.logo}
                        alt={`${contact.city} logo`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.55, color: BRAND.gray }}>
                      <strong>
                        {contact.city} | {contact.institution}
                      </strong>
                      <br />
                      Contact Number: {contact.phone}
                      <br />
                      Email: {contact.email}
                      {contact.website && (
                        <>
                          <br />
                          Website: {contact.website}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: `2px solid ${BRAND.blue}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: 20,
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 10, alignItems: "center" }}>
                    <img src={CONTACT_FOOTER_LOGOS.c4i4} alt="C4i4 Lab" style={{ height: 42, objectFit: "contain" }} />
                    <img src={CONTACT_FOOTER_LOGOS.ifactory} alt="iFactory Network" style={{ height: 42, objectFit: "contain" }} />
                  </div>
                  <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: BRAND.gray, maxWidth: 380 }}>
                    {HEAD_OFFICE.address}
                    <br />
                    Mob No.: {HEAD_OFFICE.phone}
                    <br />
                    Email: {HEAD_OFFICE.email}
                    <br />
                    Website: {HEAD_OFFICE.website}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: BRAND.gray }}>
                    Follow us on LinkedIn:
                  </p>
                  <img
                    src={LINKEDIN_QR}
                    alt="LinkedIn QR code"
                    style={{ width: 84, height: 84, display: "block" }}
                  />
                </div>
              </div>
            </ReportPage>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; background: white; }
          #print-section { max-width: 100%; padding: 0; }
          .report-page {
            page-break-after: always;
            page-break-inside: avoid;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            min-height: auto;
          }
          .cover-page {
            page-break-after: always;
            padding: 0 !important;
            overflow: hidden;
          }
          .cover-page img { width: 100% !important; height: auto !important; }
          .contents-page, .network-page {
            page-break-after: always;
            page-break-inside: avoid;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .report-page-footer {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page { size: A4; margin: 0.6in; }
          @page :first { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default OverallMonthlyReport;
