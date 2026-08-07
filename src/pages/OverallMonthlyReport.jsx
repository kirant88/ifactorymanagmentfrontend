import React, { useState, useEffect, useCallback } from "react";
import { Printer, Save, Plus, Trash2 } from "lucide-react";
import api from "../utils/api";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import { useConfirmDialog } from "../components/ConfirmDialog";
import ReportPage, { SectionTitle } from "../components/report/ReportPage";
import CoverPage from "../components/report/CoverPage";
import ContentsPage from "../components/report/ContentsPage";
import NetworkPage from "../components/report/NetworkPage";
import OurFocusPage from "../components/report/OurFocusPage";
import { CollagePage } from "../components/report/CollageGrid";
import CollageManager from "../components/report/CollageManager";
import LocationDashboard from "../components/report/LocationDashboard";
import { HBarChart } from "../components/report/LocationDashboard";
import keyAchievementsCollage from "../assets/pdfimages/key-achievements-collage.png";
import {
  BRAND,
  DEFAULT_KEY_ACHIEVEMENTS,
  DEFAULT_PROGRAM_SUMMARY,
  CONTACT_LOCATIONS,
  HEAD_OFFICE,
  LINKEDIN_QR,
  CONTACT_FOOTER_LOGOS,
  BENEFICIARIES_HISTORY,
  ORGANIZATIONS_HISTORY,
  SECTION_TYPES,
  formatMonthYear,
} from "../constants/reportConstants";

const chunkCollagePages = (groups, perPage = 2) => {
  if (!groups?.length) return [];
  const pages = [];
  for (let i = 0; i < groups.length; i += perPage) {
    pages.push(groups.slice(i, i + perPage));
  }
  return pages;
};

const OverallMonthlyReport = () => {
  const { isSuperAdmin } = useAuth();
  const { confirm, dialog: confirmDialog } = useConfirmDialog();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [locationData, setLocationData] = useState({});
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyAchievements, setKeyAchievements] = useState(DEFAULT_KEY_ACHIEVEMENTS);
  const [programSummary, setProgramSummary] = useState("");
  const [achievementCollages, setAchievementCollages] = useState([]);
  const [locationCollages, setLocationCollages] = useState({});
  const [locationGlimpses, setLocationGlimpses] = useState({});
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

  const fetchLocationGlimpses = useCallback(async () => {
    if (!locations.length) {
      setLocationGlimpses({});
      return;
    }
    try {
      const responses = await Promise.all(
        locations.map((loc) =>
          api.get("/reports/glimpses-month/", {
            params: {
              month: selectedMonth,
              year: selectedYear,
              location: loc,
            },
          }),
        ),
      );
      const map = {};
      locations.forEach((loc, idx) => {
        const rows = responses[idx]?.data?.results || responses[idx]?.data || [];
        map[loc] = Array.isArray(rows) ? rows[0] || null : null;
      });
      setLocationGlimpses(map);
    } catch (err) {
      console.error("Error fetching glimpses of the month:", err);
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
      // Prefer saved text (including intentional clears after first save).
      // Fall back to default only when the API returned no usable summary yet.
      const savedSummary =
        typeof data.program_summary === "string" ? data.program_summary.trim() : "";
      setProgramSummary(
        savedSummary || DEFAULT_PROGRAM_SUMMARY.replace("{monthYear}", monthYear),
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
    if (locations.length) {
      fetchCollages();
      fetchLocationGlimpses();
    }
  }, [locations, fetchCollages, fetchLocationGlimpses]);

  const saveReportContent = async () => {
    setIsSavingContent(true);
    try {
      await api.put("/reports/monthly-content/", {
        month: selectedMonth,
        year: selectedYear,
        key_achievements: keyAchievements,
        program_summary: programSummary,
      });
      notify.success("Report content saved!");
    } catch (err) {
      console.error(err);
      notify.error("Failed to save report content.");
    } finally {
      setIsSavingContent(false);
    }
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    setKeyAchievements((prev) => [...prev, newAchievement.trim()]);
    setNewAchievement("");
  };

  const removeAchievement = async (idx) => {
    const ok = await confirm({
      title: "Remove Achievement",
      message: "Are you sure you want to remove this achievement?",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setKeyAchievements((prev) => prev.filter((_, i) => i !== idx));
    notify.success("Achievement removed successfully!");
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
  // Pair left/right contacts into one grid so print and screen share the same row alignment.
  const contactMidpoint = Math.ceil(CONTACT_LOCATIONS.length / 2);
  const contactLeft = CONTACT_LOCATIONS.slice(0, contactMidpoint);
  const contactRight = CONTACT_LOCATIONS.slice(contactMidpoint);
  const contactGridItems = [];
  for (let i = 0; i < contactLeft.length; i += 1) {
    contactGridItems.push(contactLeft[i]);
    if (contactRight[i]) contactGridItems.push(contactRight[i]);
  }

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
            <OurFocusPage pageNumber={pageNos.ourFocus} />

            <ReportPage pageNumber={pageNos.keyAchievements}>
              <img
                src={keyAchievementsCollage}
                alt="Key Achievements collage"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  marginBottom: 22,
                  objectFit: "contain",
                }}
              />
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
                        style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: BRAND.gray }}
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
              </ReportPage>
            ))}

            {locations.map((loc) => {
              const data = locationData[loc] || {};
              const collages = locationCollages[loc] || [];
              const locPages = chunkCollagePages(collages, 2);
              const glimpses = locationGlimpses[loc] || null;

              return (
                <React.Fragment key={loc}>
                  <div className="no-print">
                    <CollageManager
                      title={`${loc} — Location Collage upload (bulk / multi-image pages)`}
                      sectionType={SECTION_TYPES.LOCATION}
                      location={loc}
                      month={selectedMonth}
                      year={selectedYear}
                      groups={collages}
                      onRefresh={fetchCollages}
                    />
                  </div>

                  <ReportPage className="location-dashboard-page" pageNumber={pageNos.locations[loc].dashboard}>
                    <LocationDashboard
                      loc={loc}
                      data={data}
                      monthYear={monthYear}
                      glimpses={glimpses}
                      month={selectedMonth}
                      year={selectedYear}
                      onGlimpsesRefresh={(next) =>
                        setLocationGlimpses((prev) => ({
                          ...prev,
                          [loc]: next ?? null,
                        }))
                      }
                    />
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
                    </ReportPage>
                  ))}
                </React.Fragment>
              );
            })}

            <ReportPage className="program-summary-page" pageNumber={pageNos.programSummary}>
              <div
                className="program-summary-layout"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  height: "100%",
                }}
              >
                <SectionTitle style={{ marginBottom: 14, flexShrink: 0 }}>
                  Program Summary
                </SectionTitle>

                {/* Screen editor — hidden in PDF */}
                <div className="no-print" style={{ marginBottom: 16, flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#78909C" }}>
                      Edit summary text — charts below resize to keep this page on one sheet.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setProgramSummary(DEFAULT_PROGRAM_SUMMARY.replace("{monthYear}", monthYear))
                      }
                      style={{
                        background: "none",
                        border: "1px solid #CFD8DC",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        color: "#546E7A",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Reset to default
                    </button>
                  </div>
                  <textarea
                    value={programSummary}
                    onChange={(e) => setProgramSummary(e.target.value)}
                    rows={4}
                    placeholder="Write the program summary for this month…"
                    spellCheck
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      border: "1px solid #90CAF9",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#546E7A",
                      background: "#FAFCFF",
                      resize: "vertical",
                      minHeight: 88,
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* PDF / print text — height follows {programSummary} */}
                <p
                  className="print-only program-summary-text"
                  style={{
                    color: "#546E7A",
                    fontSize:
                      programSummary.length > 700
                        ? 12
                        : programSummary.length > 450
                          ? 13
                          : programSummary.length > 280
                            ? 14
                            : 15,
                    lineHeight: 1.65,
                    margin: "0 0 18px",
                    whiteSpace: "pre-wrap",
                    flexShrink: 0,
                  }}
                >
                  {programSummary}
                </p>

                {/* Stacked charts fill remaining page height */}
                <div
                  className="program-summary-charts"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    flex: "1 1 0",
                    minHeight: 0,
                  }}
                >
                  <div style={{ flex: "1 1 0", minHeight: 0 }}>
                    <HBarChart
                      large
                      data={BENEFICIARIES_HISTORY}
                      color={BRAND.blue}
                      title="Beneficiaries Data"
                    />
                  </div>
                  <div style={{ flex: "1 1 0", minHeight: 0 }}>
                    <HBarChart
                      large
                      data={ORGANIZATIONS_HISTORY}
                      color={BRAND.accent}
                      title="Organizations Data"
                    />
                  </div>
                </div>
              </div>
            </ReportPage>

            <ReportPage className="contact-page" pageNumber={pageNos.contact}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: -70,
                    bottom: 70,
                    width: 280,
                    height: 180,
                    background: "linear-gradient(135deg, rgba(41, 182, 246, 0.08), rgba(21, 101, 192, 0.18))",
                    transform: "skewX(-28deg)",
                    borderRadius: 24,
                  }}
                />

                <SectionTitle style={{ marginBottom: 20, position: "relative", zIndex: 1 }}>
                  Contact Us
                </SectionTitle>

                <div
                  className="contact-list"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: 22,
                    rowGap: 12,
                    width: "100%",
                    alignItems: "stretch",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {contactGridItems.map((contact) => (
                    <div
                      key={contact.city}
                      className="contact-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "92px minmax(0, 1fr)",
                        gap: 14,
                        alignItems: "start",
                        paddingBottom: 10,
                        borderBottom: "1px solid #DCE8F5",
                        minWidth: 0,
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        className="contact-logo"
                        style={{
                          width: 92,
                          height: 56,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={contact.logo}
                          alt={`${contact.city} logo`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className="contact-details" style={{ fontSize: 11.5, lineHeight: 1.45, color: BRAND.gray, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: BRAND.blueDark, marginBottom: 3 }}>
                          {contact.city}
                        </div>
                        <div style={{ fontWeight: 600, marginBottom: 3 }}>{contact.institution}</div>
                        <div>Contact Number: {contact.phone}</div>
                        <div>Email: {contact.email}</div>
                        {contact.website ? <div>Website: {contact.website}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ flex: 1, minHeight: 12 }} />

                <div
                  className="contact-footer-block"
                  style={{
                    marginTop: 22,
                    paddingTop: 14,
                    borderTop: `2px solid ${BRAND.blue}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 24,
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: 14, marginBottom: 8, alignItems: "center" }}>
                      <img src={CONTACT_FOOTER_LOGOS.c4i4} alt="C4i4 Lab" style={{ height: 38, objectFit: "contain" }} />
                      <img src={CONTACT_FOOTER_LOGOS.ifactory} alt="iFactory Network" style={{ height: 38, objectFit: "contain" }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.5, color: BRAND.gray, maxWidth: 390 }}>
                      {HEAD_OFFICE.address}
                      <br />
                      Mob No.: {HEAD_OFFICE.phone}
                      <br />
                      Email: {HEAD_OFFICE.email}
                      <br />
                      Website: {HEAD_OFFICE.website}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 10.5, fontWeight: 700, color: BRAND.gray }}>
                      Follow us on LinkedIn
                    </p>
                    <img
                      src={LINKEDIN_QR}
                      alt="LinkedIn QR code"
                      style={{ width: 78, height: 78, display: "block" }}
                    />
                  </div>
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
          html, body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #print-section {
            max-width: none !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .report-page {
            width: 210mm !important;
            height: 296mm !important;
            min-height: 296mm !important;
            max-height: 296mm !important;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            break-inside: avoid;
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .report-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .cover-page {
            padding: 0 !important;
            overflow: hidden !important;
          }
          .cover-page img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          .contents-page {
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .report-page-footer {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .report-page-body {
            padding: 18px 28px 10px !important;
          }
          .report-page-header {
            margin-bottom: 14px !important;
            padding-bottom: 8px !important;
          }
          .report-page-header img {
            height: 36px !important;
          }
          .contact-page {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Keep Contact Us sizing identical to screen so PDF matches the React layout */
          .contact-page .report-page-body {
            padding: 28px 40px 16px !important;
          }
          .contact-page .report-page-header {
            margin-bottom: 28px !important;
            padding-bottom: 12px !important;
          }
          .contact-page .report-page-header img {
            height: 44px !important;
          }
          .contact-page .report-page-content {
            justify-content: flex-start !important;
          }
          .contact-page .contact-list {
            width: 100% !important;
            grid-template-columns: 1fr 1fr !important;
            column-gap: 22px !important;
            row-gap: 12px !important;
          }
          .contact-page .contact-row {
            grid-template-columns: 92px minmax(0, 1fr) !important;
            gap: 14px !important;
            padding-bottom: 10px !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .contact-page .contact-logo {
            width: 92px !important;
            height: 56px !important;
          }
          .contact-page .contact-logo img {
            max-height: 56px !important;
          }
          .contact-page .contact-details {
            font-size: 11.5px !important;
            line-height: 1.45 !important;
          }
          .contact-page .contact-footer-block {
            margin-top: 22px !important;
            padding-top: 14px !important;
            width: 100% !important;
          }
          .location-dashboard-page {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .program-summary-page {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .program-summary-page .report-page-body {
            padding: 24px 36px 10px !important;
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            min-height: 0 !important;
          }
          .program-summary-page .report-page-header {
            margin-bottom: 16px !important;
            padding-bottom: 10px !important;
            flex-shrink: 0 !important;
          }
          .program-summary-page .report-page-content {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .program-summary-page .program-summary-layout {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .program-summary-page .program-summary-text {
            display: block !important;
            flex: 0 0 auto !important;
            margin: 0 0 16px !important;
            line-height: 1.65 !important;
          }
          .program-summary-page .program-summary-charts {
            display: flex !important;
            flex-direction: column !important;
            flex: 1 1 0 !important;
            min-height: 0 !important;
            gap: 14px !important;
          }
          .program-summary-page .program-summary-charts > div {
            flex: 1 1 0 !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .program-summary-page .hbar-chart {
            flex: 1 1 auto !important;
            height: 100% !important;
            min-height: 0 !important;
            box-shadow: none !important;
            border: 1px solid #DCE3EB !important;
            border-radius: 10px !important;
            padding: 14px 18px !important;
          }
          .program-summary-page .hbar-chart h3 {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
      {confirmDialog}
    </div>
  );
};

export default OverallMonthlyReport;
