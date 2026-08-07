import React from "react";
import { BRAND } from "../../constants/reportConstants";

const CollageGrid = ({ title, images, captionStyle = {} }) => {
  if (!images?.length) return null;

  const cols = 2;
  const rows = images.length / cols;

  return (
    <div style={{ marginBottom: rows > 1 ? 28 : 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 14,
          marginBottom: 10,
        }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: 10,
              overflow: "hidden",
              aspectRatio: "4/3",
              background: BRAND.grayLight,
            }}
          >
            <img
              src={img.image_data}
              alt={img.image_name || `Image ${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
      {title && (
        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 0.8,
            color: "#263238",
            textTransform: "uppercase",
            ...captionStyle,
          }}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export const CollagePage = ({ groups, pageTitle }) => (
  <>
    {pageTitle && (
      <h2
        style={{
          margin: "0 0 24px",
          fontSize: 24,
          fontWeight: 800,
          color: BRAND.blue,
        }}
      >
        {pageTitle}
      </h2>
    )}
    {groups.map((group) => (
      <CollageGrid key={group.id} title={group.title} images={group.images} />
    ))}
  </>
);

export default CollageGrid;
