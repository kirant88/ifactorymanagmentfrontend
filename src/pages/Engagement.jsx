import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Engagement = () => {
  const { user, isSuperAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [availableLocations, setAvailableLocations] = useState([
    "All Locations",
  ]);

  // Pagination states for each section
  const [eventPage, setEventPage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(10);
  const [eventTotal, setEventTotal] = useState(0);

  const [collabPage, setCollabPage] = useState(1);
  const [collabPageSize, setCollabPageSize] = useState(10);
  const [collabTotal, setCollabTotal] = useState(0);

  const [socialPage, setSocialPage] = useState(1);
  const [socialPageSize, setSocialPageSize] = useState(10);
  const [socialTotal, setSocialTotal] = useState(0);

  // Edit mode states for each table
  const [isEventEditing, setIsEventEditing] = useState(false);
  const [tempEvents, setTempEvents] = useState([]);

  const [isCollaborationEditing, setIsCollaborationEditing] = useState(false);
  const [tempCollaborations, setTempCollaborations] = useState([]);

  const [isSocialMediaEditing, setIsSocialMediaEditing] = useState(false);
  const [tempSocialMedia, setTempSocialMedia] = useState([]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] =
    useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);

  const [eventForm, setEventForm] = useState({
    category: "",
    event_title: "",
    date: "",
    audience_type: "",
    participants_count: "",
    photograph_link: "",
  });

  const [collaborationForm, setCollaborationForm] = useState({
    partner_name: "",
    partner_type: "",
    purpose: "",
    start_date: "",
    status: "",
    photograph_link: "",
  });

  const [socialMediaForm, setSocialMediaForm] = useState({
    platform: "",
    content_type: "",
    post_date: "",
    objective: "",
    engagement: "",
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
  }, [
    eventPage,
    eventPageSize,
    collabPage,
    collabPageSize,
    socialPage,
    socialPageSize,
    filterLocation,
  ]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = { location: filterLocation };
      const [eventsRes, collabRes, socialRes] = await Promise.all([
        api.get("/engagement/events/", {
          params: { ...params, page: eventPage, page_size: eventPageSize },
        }),
        api.get("/engagement/collaborations/", {
          params: { ...params, page: collabPage, page_size: collabPageSize },
        }),
        api.get("/engagement/social-media/", {
          params: { ...params, page: socialPage, page_size: socialPageSize },
        }),
      ]);

      const eventsData = eventsRes.data.results || eventsRes.data;
      const collabData = collabRes.data.results || collabRes.data;
      const socialData = socialRes.data.results || socialRes.data;

      setEvents(eventsData);
      setTempEvents(eventsData.map((e) => ({ ...e })));
      setEventTotal(eventsRes.data.count || 0);

      setCollaborations(collabData);
      setTempCollaborations(collabData.map((c) => ({ ...c })));
      setCollabTotal(collabRes.data.count || 0);

      setSocialMediaPosts(socialData);
      setTempSocialMedia(socialData.map((s) => ({ ...s })));
      setSocialTotal(socialRes.data.count || 0);
    } catch (error) {
      console.error("Error fetching engagement data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      await api.post("/engagement/events/", eventForm);
      setEventPage(1);
      await fetchData();
      setIsEventModalOpen(false);
      setEventForm({
        category: "",
        event_title: "",
        date: "",
        audience_type: "",
        participants_count: "",
        photograph_link: "",
      });
    } catch (error) {
      alert("Error adding event.");
    }
  };

  const handleAddCollaboration = async () => {
    try {
      await api.post("/engagement/collaborations/", collaborationForm);
      setCollabPage(1);
      await fetchData();
      setIsCollaborationModalOpen(false);
      setCollaborationForm({
        partner_name: "",
        partner_type: "",
        purpose: "",
        start_date: "",
        status: "",
        photograph_link: "",
      });
    } catch (error) {
      alert("Error adding collaboration.");
    }
  };

  const handleAddSocialMedia = async () => {
    try {
      await api.post("/engagement/social-media/", socialMediaForm);
      setSocialPage(1);
      await fetchData();
      setIsSocialMediaModalOpen(false);
      setSocialMediaForm({
        platform: "",
        content_type: "",
        post_date: "",
        objective: "",
        engagement: "",
        photograph_link: "",
      });
    } catch (error) {
      alert("Error adding social media post.");
    }
  };

  // Event inline editing handlers
  const handleEventInlineChange = (index, field, value) => {
    const updated = [...tempEvents];
    updated[index][field] = value;
    setTempEvents(updated);
  };

  const handleSaveEvents = async () => {
    try {
      setIsLoading(true);
      const changedEvents = tempEvents.filter((e, i) => {
        const original = events[i];
        return JSON.stringify(e) !== JSON.stringify(original);
      });

      if (changedEvents.length === 0) {
        setIsEventEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedEvents.map((e) =>
        api.patch(`/engagement/events/${e.id}/`, {
          category: e.category,
          event_title: e.event_title,
          date: e.date,
          audience_type: e.audience_type,
          participants_count: e.participants_count,
          photograph_link: e.photograph_link,
        }),
      );

      await Promise.all(promises);
      await fetchData();
      setIsEventEditing(false);
      alert("All event changes saved successfully!");
    } catch (error) {
      console.error("Error saving event edits:", error);
      alert("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEvents = () => {
    setIsEventEditing(false);
    setTempEvents(events.map((e) => ({ ...e })));
  };

  // Collaboration inline editing handlers
  const handleCollaborationInlineChange = (index, field, value) => {
    const updated = [...tempCollaborations];
    updated[index][field] = value;
    setTempCollaborations(updated);
  };

  const handleSaveCollaborations = async () => {
    try {
      setIsLoading(true);
      const changedCollaborations = tempCollaborations.filter((c, i) => {
        const original = collaborations[i];
        return JSON.stringify(c) !== JSON.stringify(original);
      });

      if (changedCollaborations.length === 0) {
        setIsCollaborationEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedCollaborations.map((c) =>
        api.patch(`/engagement/collaborations/${c.id}/`, {
          partner_name: c.partner_name,
          partner_type: c.partner_type,
          purpose: c.purpose,
          start_date: c.start_date,
          status: c.status,
          photograph_link: c.photograph_link,
        }),
      );

      await Promise.all(promises);
      await fetchData();
      setIsCollaborationEditing(false);
      alert("All collaboration changes saved successfully!");
    } catch (error) {
      console.error("Error saving collaboration edits:", error);
      alert("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelCollaborations = () => {
    setIsCollaborationEditing(false);
    setTempCollaborations(collaborations.map((c) => ({ ...c })));
  };

  // Social Media inline editing handlers
  const handleSocialMediaInlineChange = (index, field, value) => {
    const updated = [...tempSocialMedia];
    updated[index][field] = value;
    setTempSocialMedia(updated);
  };

  const handleSaveSocialMedia = async () => {
    try {
      setIsLoading(true);
      const changedPosts = tempSocialMedia.filter((s, i) => {
        const original = socialMediaPosts[i];
        return JSON.stringify(s) !== JSON.stringify(original);
      });

      if (changedPosts.length === 0) {
        setIsSocialMediaEditing(false);
        setIsLoading(false);
        return;
      }

      const promises = changedPosts.map((s) =>
        api.patch(`/engagement/social-media/${s.id}/`, {
          platform: s.platform,
          content_type: s.content_type,
          post_date: s.post_date,
          objective: s.objective,
          engagement: s.engagement,
          photograph_link: s.photograph_link,
        }),
      );

      await Promise.all(promises);
      await fetchData();
      setIsSocialMediaEditing(false);
      alert("All social media changes saved successfully!");
    } catch (error) {
      console.error("Error saving social media edits:", error);
      alert("Failed to save changes. Please check your data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSocialMedia = () => {
    setIsSocialMediaEditing(false);
    setTempSocialMedia(socialMediaPosts.map((s) => ({ ...s })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Engagement Management
          </h1>
          <p className="text-gray-500">
            Events, Collaborations, and Social Media for{" "}
            {user?.location || "All Locations"}
          </p>
        </div>
        <div className="flex gap-3">
          {isSuperAdmin && (
            <select
              value={filterLocation}
              onChange={(e) => {
                setFilterLocation(e.target.value);
                setEventPage(1);
                setCollabPage(1);
                setSocialPage(1);
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

      {/* Events & Programs Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Events & Programs</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isEventEditing) {
                  handleSaveEvents();
                } else {
                  setIsEventEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isEventEditing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
              }`}
            >
              {isEventEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
            </button>
            {isEventEditing && (
              <button
                onClick={handleCancelEvents}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <DataTable
          title={`Events & Programs ${isEventEditing ? "(Edit Mode Active)" : ""}`}
          isLoading={isLoading}
          columns={[
            {
              header: "Category",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempEvents[i]?.category || ""}
                    onChange={(e) =>
                      handleEventInlineChange(i, "category", e.target.value)
                    }
                  />
                ) : (
                  row.category || "-"
                ),
            },
            {
              header: "Event / Program Title",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempEvents[i]?.event_title || ""}
                    onChange={(e) =>
                      handleEventInlineChange(i, "event_title", e.target.value)
                    }
                  />
                ) : (
                  row.event_title || "-"
                ),
            },
            {
              header: "Date",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempEvents[i]?.date || ""}
                    onChange={(e) =>
                      handleEventInlineChange(i, "date", e.target.value)
                    }
                  />
                ) : (
                  row.date || "-"
                ),
            },
            {
              header: "Audience Type",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempEvents[i]?.audience_type || ""}
                    onChange={(e) =>
                      handleEventInlineChange(
                        i,
                        "audience_type",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.audience_type || "-"
                ),
            },
            {
              header: "Participants Count",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    value={tempEvents[i]?.participants_count || ""}
                    onChange={(e) =>
                      handleEventInlineChange(
                        i,
                        "participants_count",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.participants_count || "-"
                ),
            },
            {
              header: "Photograph",
              render: (row, i) =>
                isEventEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Drive URL"
                    value={tempEvents[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleEventInlineChange(
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
          data={events}
          onAdd={() => !isEventEditing && setIsEventModalOpen(true)}
          pagination={{
            currentPage: eventPage,
            totalPages: Math.ceil(eventTotal / eventPageSize),
            totalCount: eventTotal,
            pageSize: eventPageSize,
            onPageChange: (p) => !isEventEditing && setEventPage(p),
            onPageSizeChange: (s) => {
              if (!isEventEditing) {
                setEventPageSize(s);
                setEventPage(1);
              }
            },
          }}
        />
      </section>

      {/* Collaborations Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Collaborations</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isCollaborationEditing) {
                  handleSaveCollaborations();
                } else {
                  setIsCollaborationEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isCollaborationEditing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
              }`}
            >
              {isCollaborationEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
            </button>
            {isCollaborationEditing && (
              <button
                onClick={handleCancelCollaborations}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <DataTable
          title={`Collaborations ${isCollaborationEditing ? "(Edit Mode Active)" : ""}`}
          isLoading={isLoading}
          columns={[
            {
              header: "Partner Name",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempCollaborations[i]?.partner_name || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
                        i,
                        "partner_name",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.partner_name || "-"
                ),
            },
            {
              header: "Partner Type",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempCollaborations[i]?.partner_type || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
                        i,
                        "partner_type",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.partner_type || "-"
                ),
            },
            {
              header: "Purpose",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <textarea
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    rows="2"
                    value={tempCollaborations[i]?.purpose || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
                        i,
                        "purpose",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.purpose || "-"
                ),
            },
            {
              header: "Start Date",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempCollaborations[i]?.start_date || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
                        i,
                        "start_date",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.start_date || "-"
                ),
            },
            {
              header: "Status",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    value={tempCollaborations[i]?.status || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
                        i,
                        "status",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.status || "-"
                ),
            },
            {
              header: "Photograph",
              render: (row, i) =>
                isCollaborationEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                    placeholder="Drive URL"
                    value={tempCollaborations[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleCollaborationInlineChange(
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
          data={collaborations}
          onAdd={() =>
            !isCollaborationEditing && setIsCollaborationModalOpen(true)
          }
          pagination={{
            currentPage: collabPage,
            totalPages: Math.ceil(collabTotal / collabPageSize),
            totalCount: collabTotal,
            pageSize: collabPageSize,
            onPageChange: (p) => !isCollaborationEditing && setCollabPage(p),
            onPageSizeChange: (s) => {
              if (!isCollaborationEditing) {
                setCollabPageSize(s);
                setCollabPage(1);
              }
            },
          }}
        />
      </section>

      {/* Social Media Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Social Media Posts / Website Updates
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isSocialMediaEditing) {
                  handleSaveSocialMedia();
                } else {
                  setIsSocialMediaEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${
                isSocialMediaEditing
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/30 animate-pulse"
                  : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30"
              }`}
            >
              {isSocialMediaEditing ? "✓ Save Changes" : "✎ Enable Edit Mode"}
            </button>
            {isSocialMediaEditing && (
              <button
                onClick={handleCancelSocialMedia}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <DataTable
          title={`Social Media Posts / Website Updates ${isSocialMediaEditing ? "(Edit Mode Active)" : ""}`}
          isLoading={isLoading}
          columns={[
            {
              header: "Platform",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    value={tempSocialMedia[i]?.platform || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
                        i,
                        "platform",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.platform || "-"
                ),
            },
            {
              header: "Content Type",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    value={tempSocialMedia[i]?.content_type || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
                        i,
                        "content_type",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.content_type || "-"
                ),
            },
            {
              header: "Date",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    value={tempSocialMedia[i]?.post_date || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
                        i,
                        "post_date",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.post_date || "-"
                ),
            },
            {
              header: "Objective",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <textarea
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    rows="2"
                    value={tempSocialMedia[i]?.objective || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
                        i,
                        "objective",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.objective || "-"
                ),
            },
            {
              header: "Engagement",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    placeholder="e.g. 1.2K likes"
                    value={tempSocialMedia[i]?.engagement || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
                        i,
                        "engagement",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  row.engagement || "-"
                ),
            },
            {
              header: "Photograph",
              render: (row, i) =>
                isSocialMediaEditing ? (
                  <input
                    className="w-full px-2 py-1 border rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                    placeholder="Drive URL"
                    value={tempSocialMedia[i]?.photograph_link || ""}
                    onChange={(e) =>
                      handleSocialMediaInlineChange(
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
          data={socialMediaPosts}
          onAdd={() => !isSocialMediaEditing && setIsSocialMediaModalOpen(true)}
          pagination={{
            currentPage: socialPage,
            totalPages: Math.ceil(socialTotal / socialPageSize),
            totalCount: socialTotal,
            pageSize: socialPageSize,
            onPageChange: (p) => !isSocialMediaEditing && setSocialPage(p),
            onPageSizeChange: (s) => {
              if (!isSocialMediaEditing) {
                setSocialPageSize(s);
                setSocialPage(1);
              }
            },
          }}
        />
      </section>

      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Add Event / Program"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={eventForm.category}
              onChange={(e) =>
                setEventForm({ ...eventForm, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
              <option value="Training">Training</option>
              <option value="Webinar">Webinar</option>
              <option value="Competition">Competition</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event / Program Title
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={eventForm.event_title}
              onChange={(e) =>
                setEventForm({ ...eventForm, event_title: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={eventForm.date}
                max={new Date().toISOString().split("T")[0]} // ← add this
                onChange={(e) =>
                  setEventForm({ ...eventForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience Type
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={eventForm.audience_type}
                onChange={(e) =>
                  setEventForm({ ...eventForm, audience_type: e.target.value })
                }
              >
                <option value="">Select Audience</option>
                <option value="Students">Students</option>
                <option value="Faculty">Faculty</option>
                <option value="Industry Professionals">
                  Industry Professionals
                </option>
                <option value="General Public">General Public</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participants Count
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={eventForm.participants_count}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  participants_count: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photograph Link (Optional)
            </label>
            <input
              placeholder="Drive URL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={eventForm.photograph_link}
              onChange={(e) =>
                setEventForm({ ...eventForm, photograph_link: e.target.value })
              }
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEvent}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold"
            >
              Add Event
            </button>
          </div>
        </div>
      </Modal>

      {/* Collaboration Modal */}
      <Modal
        isOpen={isCollaborationModalOpen}
        onClose={() => setIsCollaborationModalOpen(false)}
        title="Add Collaboration"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={collaborationForm.partner_name}
              onChange={(e) =>
                setCollaborationForm({
                  ...collaborationForm,
                  partner_name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={collaborationForm.partner_type}
              onChange={(e) =>
                setCollaborationForm({
                  ...collaborationForm,
                  partner_type: e.target.value,
                })
              }
            >
              <option value="">Select Type</option>
              <option value="Industry">Industry</option>
              <option value="Institution">Institution</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={collaborationForm.purpose}
              onChange={(e) =>
                setCollaborationForm({
                  ...collaborationForm,
                  purpose: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={collaborationForm.start_date}
                max={new Date().toISOString().split("T")[0]} // ← add this
                onChange={(e) =>
                  setCollaborationForm({
                    ...collaborationForm,
                    start_date: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={collaborationForm.status}
                onChange={(e) =>
                  setCollaborationForm({
                    ...collaborationForm,
                    status: e.target.value,
                  })
                }
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photograph Link (Optional)
            </label>
            <input
              placeholder="Drive URL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={collaborationForm.photograph_link}
              onChange={(e) =>
                setCollaborationForm({
                  ...collaborationForm,
                  photograph_link: e.target.value,
                })
              }
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsCollaborationModalOpen(false)}
              className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCollaboration}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20 font-bold"
            >
              Add Collaboration
            </button>
          </div>
        </div>
      </Modal>

      {/* Social Media Modal */}
      <Modal
        isOpen={isSocialMediaModalOpen}
        onClose={() => setIsSocialMediaModalOpen(false)}
        title="Add Social Media Update"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.platform}
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  platform: e.target.value,
                })
              }
            >
              <option value="">Select Platform</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter/X">Twitter/X</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.content_type}
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  content_type: e.target.value,
                })
              }
            >
              <option value="">Select Type</option>
              <option value="Achievement">Achievement</option>
              <option value="Event Announcement">Event Announcement</option>
              <option value="News">News</option>
              <option value="Article">Article</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.post_date}
              max={new Date().toISOString().split("T")[0]} // ← add this
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  post_date: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objective
            </label>
            <textarea
              rows="2"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.objective}
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  objective: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.engagement}
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  engagement: e.target.value,
                })
              }
              placeholder="e.g. 1.2K likes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photograph Link (Optional)
            </label>
            <input
              placeholder="Drive URL"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={socialMediaForm.photograph_link}
              onChange={(e) =>
                setSocialMediaForm({
                  ...socialMediaForm,
                  photograph_link: e.target.value,
                })
              }
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              onClick={() => setIsSocialMediaModalOpen(false)}
              className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSocialMedia}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg shadow-purple-500/20 font-bold"
            >
              Add Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Engagement;
