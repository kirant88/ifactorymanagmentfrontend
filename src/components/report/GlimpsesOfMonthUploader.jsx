import React, { useRef, useState, useEffect } from "react";
import { Save, Trash2, ImagePlus } from "lucide-react";
import api from "../../utils/api";
import { notify } from "../../utils/toast";
import { BRAND } from "../../constants/reportConstants";
import { useConfirmDialog } from "../ConfirmDialog";

const MAX_IMAGES = 2;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ image_data: e.target.result, image_name: file.name });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Dedicated uploader for Performance Analysis "Glimpses of the Month".
 * Separate from collage/bulk uploads. Exactly 2 images + bottom title.
 */
const GlimpsesOfMonthUploader = ({
  location,
  month,
  year,
  record,
  onRefresh,
  compact = false,
}) => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  useEffect(() => {
    setTitle(record?.title || "");
    setImages(Array.isArray(record?.images) ? record.images.slice(0, MAX_IMAGES) : []);
  }, [record]);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

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

    const remaining = MAX_IMAGES - images.length;
    const encoded = await Promise.all(files.slice(0, remaining).map(fileToBase64));
    setImages((prev) => [...prev, ...encoded].slice(0, MAX_IMAGES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = async (idx) => {
    const ok = await confirm({
      title: "Remove Image",
      message: "Are you sure you want to remove this image?",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    setImages((prev) => prev.filter((_, i) => i !== idx));
    notify.success("Image removed successfully!");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      notify.info("Please enter a bottom title (e.g. company or event name).");
      return;
    }
    if (images.length !== MAX_IMAGES) {
      notify.info(`Please upload exactly ${MAX_IMAGES} images.`);
      return;
    }

    setIsSaving(true);
    const payload = {
      month,
      year,
      location,
      title: title.trim(),
      images,
    };
    const previous = record ?? null;
    onRefresh?.({
      ...(record || {}),
      ...payload,
      id: record?.id,
    });

    try {
      const res = record?.id
        ? await api.patch(`/reports/glimpses-month/${record.id}/`, payload)
        : await api.post("/reports/glimpses-month/", payload);
      onRefresh?.(res.data);
      notify.success("Glimpses of the Month saved!");
    } catch (err) {
      onRefresh?.(previous);
      console.error(err);
      const detail =
        err.response?.data?.images?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to save Glimpses of the Month.";
      notify.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!record?.id) {
      const ok = await confirm({
        title: "Clear Glimpses",
        message: "Are you sure you want to clear the current glimpses content?",
        confirmLabel: "Remove",
      });
      if (!ok) return;
      setTitle("");
      setImages([]);
      onRefresh?.(null);
      notify.success("Glimpses cleared successfully!");
      return;
    }
    const ok = await confirm({
      title: "Remove Glimpses",
      message: "Are you sure you want to remove Glimpses of the Month for this location? This action cannot be undone.",
      confirmLabel: "Remove",
    });
    if (!ok) return;
    const previous = record;
    setTitle("");
    setImages([]);
    onRefresh?.(null);
    try {
      await api.delete(`/reports/glimpses-month/${record.id}/`);
      notify.success("Glimpses deleted successfully!");
    } catch (err) {
      onRefresh?.(previous);
      setTitle(previous.title || "");
      setImages(Array.isArray(previous.images) ? previous.images.slice(0, MAX_IMAGES) : []);
      console.error(err);
      notify.error("Failed to delete glimpses.");
    }
  };

  return (
    <div
      className="no-print"
      style={{
        background: "#E8F5E9",
        borderRadius: 12,
        padding: compact ? 14 : 20,
        marginBottom: compact ? 0 : 16,
        marginTop: compact ? 16 : 0,
        border: "1px solid #A5D6A7",
      }}
    >
      <h4 style={{ margin: "0 0 6px", color: "#1B5E20", fontWeight: 700, fontSize: compact ? 14 : undefined }}>
        {location} — Glimpses of the Month (card report)
      </h4>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#546E7A" }}>
        Separate from collage upload. Shows inside Performance Analysis. Max {MAX_IMAGES}{" "}
        images + bottom title.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <input
          type="text"
          placeholder="Bottom title (e.g. Tata Motors Ltd)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: "1 1 260px",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${BRAND.green}`,
            fontSize: 14,
          }}
        />
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 14px",
            background: "white",
            borderRadius: 8,
            border: `1.5px solid ${BRAND.green}`,
            cursor: images.length >= MAX_IMAGES ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: 13,
            color: BRAND.green,
            opacity: images.length >= MAX_IMAGES ? 0.55 : 1,
          }}
        >
          <ImagePlus size={16} />
          Choose images ({images.length}/{MAX_IMAGES})
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={images.length >= MAX_IMAGES}
            onChange={handleFiles}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
            maxWidth: compact ? 360 : 420,
          }}
        >
          {images.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={img.image_data}
                alt={img.image_name || `Glimpse ${idx + 1}`}
                style={{
                  width: "100%",
                  height: compact ? 90 : 110,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "2px solid #D4C4A8",
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "#C62828",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
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
          <Save size={16} />
          {record?.id ? "Update Glimpses" : "Save Glimpses"}
        </button>
        {(record?.id || images.length > 0 || title) && (
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              background: "#FFEBEE",
              color: "#C62828",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>
      {confirmDialog}
    </div>
  );
};

export default GlimpsesOfMonthUploader;
