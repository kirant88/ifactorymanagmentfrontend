import React, { useRef, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import api from "../../utils/api";
import { notify } from "../../utils/toast";
import { BRAND, COLLAGE_IMAGE_COUNTS } from "../../constants/reportConstants";
import { useConfirmDialog } from "../ConfirmDialog";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ image_data: e.target.result, image_name: file.name });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CollageManager = ({
  sectionType,
  location = null,
  month,
  year,
  groups,
  onRefresh,
  title = "Manage Collage",
  imageCounts = COLLAGE_IMAGE_COUNTS,
}) => {
  const fileInputRef = useRef(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [imageCount, setImageCount] = useState(imageCounts[0] || 2);
  const [draftImages, setDraftImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const allowedCounts = imageCounts?.length ? imageCounts : COLLAGE_IMAGE_COUNTS;
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  const resetDraft = () => {
    setDraftTitle("");
    setDraftImages([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = imageCount - draftImages.length;
    const toAdd = files.slice(0, remaining);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        notify.info("Please select image files only.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify.info("Each image must be under 5MB.");
        return;
      }
    }

    const encoded = await Promise.all(toAdd.map(fileToBase64));
    setDraftImages((prev) => [...prev, ...encoded].slice(0, imageCount));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDraftImage = async (idx) => {
    const ok = await confirm({
      title: "Remove Image",
      message: "Are you sure you want to remove this image?",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setDraftImages((prev) => prev.filter((_, i) => i !== idx));
    notify.success("Image removed successfully!");
  };

  const startEdit = (group) => {
    setEditingId(group.id);
    setDraftTitle(group.title);
    const count = allowedCounts.includes(group.images.length)
      ? group.images.length
      : allowedCounts[0];
    setImageCount(count);
    setDraftImages(group.images.slice(0, count));
  };

  const handleSave = async () => {
    if (!draftTitle.trim()) {
      notify.info("Please enter a title/caption for this collage.");
      return;
    }
    if (!allowedCounts.includes(draftImages.length)) {
      notify.info(`Please upload exactly ${imageCount} image${imageCount === 1 ? "" : "s"}.`);
      return;
    }

    setIsSaving(true);
    const payload = {
      month,
      year,
      section_type: sectionType,
      location,
      title: draftTitle.trim(),
      images: draftImages,
      sort_order: groups.length,
    };

    try {
      if (editingId) {
        await api.patch(`/reports/collage-groups/${editingId}/`, payload);
      } else {
        await api.post("/reports/collage-groups/", payload);
      }
      resetDraft();
      onRefresh();
      notify.success("Collage saved successfully!");
    } catch (err) {
      console.error(err);
      notify.error(err.response?.data?.images?.[0] || "Failed to save collage.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete Collage",
      message: "Are you sure you want to delete this collage group? This action cannot be undone.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await api.delete(`/reports/collage-groups/${id}/`);
      onRefresh();
      notify.success("Collage deleted successfully!");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete collage.");
    }
  };

  return (
    <div
      className="no-print"
      style={{
        background: BRAND.blueLight,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        border: `1px solid ${BRAND.blue}33`,
      }}
    >
      <h4 style={{ margin: "0 0 16px", color: BRAND.blueDark, fontWeight: 700 }}>
        {title}
      </h4>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Collage title (e.g. TRICHY - PRE INCUBATION EVENT)"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          style={{
            flex: "1 1 280px",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${BRAND.blue}`,
            fontSize: 14,
          }}
        />
        <select
          value={imageCount}
          onChange={(e) => {
            const count = parseInt(e.target.value, 10);
            setImageCount(count);
            setDraftImages((prev) => prev.slice(0, count));
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${BRAND.blue}`,
            fontWeight: 600,
          }}
        >
          {allowedCounts.map((n) => (
            <option key={n} value={n}>
              {n} images
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          style={{ maxWidth: 220 }}
        />
      </div>

      {draftImages.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {draftImages.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={img.image_data}
                alt=""
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <button
                type="button"
                onClick={() => removeDraftImage(idx)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "#C62828",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 6px",
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
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
          <Save size={16} />
          {editingId ? "Update Collage" : "Add Collage"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetDraft}
            style={{
              padding: "9px 18px",
              background: "#78909C",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {groups.length > 0 && (
        <div style={{ borderTop: `1px solid ${BRAND.blue}44`, paddingTop: 16 }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#546E7A" }}>
            Saved collages ({groups.length})
          </p>
          {groups.map((group) => (
            <div
              key={group.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "white",
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <strong style={{ fontSize: 13 }}>{group.title}</strong>
                <span style={{ marginLeft: 10, fontSize: 12, color: "#78909C" }}>
                  {group.images.length} images
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => startEdit(group)}
                  style={{
                    padding: "6px 12px",
                    background: BRAND.blueLight,
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(group.id)}
                  style={{
                    padding: "6px 10px",
                    background: "#FFEBEE",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#C62828",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ margin: "12px 0 0", fontSize: 12, color: "#78909C" }}>
        <Plus size={12} style={{ verticalAlign: "middle" }} /> Upload{" "}
        {allowedCounts.join(", ")} image{allowedCounts.length === 1 && allowedCounts[0] === 1 ? "" : "s"}{" "}
        per collage. Title appears below the images in the report.
      </p>
      {confirmDialog}
    </div>
  );
};

export default CollageManager;
