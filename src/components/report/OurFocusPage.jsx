import React from "react";
import ReportPage, { SectionTitle } from "./ReportPage";
import {
  BRAND,
  OUR_FOCUS_ITEMS,
  BENEFICIARIES_ITEMS,
  TRAINING_DESCRIPTION,
  OUR_FOCUS_BADGES,
} from "../../constants/reportConstants";

const FONT =
  "'Segoe UI', Roboto, Montserrat, Arial, Helvetica, sans-serif";

const bodyText = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.7,
  color: BRAND.gray,
  fontFamily: FONT,
};

const BulletList = ({ items }) => (
  <ul
    style={{
      margin: "0 0 28px",
      padding: 0,
      listStyle: "none",
    }}
  >
    {items.map((item, i) => (
      <li
        key={i}
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 10,
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
        <span style={{ ...bodyText, flex: 1 }}>{item}</span>
      </li>
    ))}
  </ul>
);

const DotChevronDecor = ({ style = {} }) => {
  const rows = [
    [0],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3],
    [0, 1, 2],
    [0, 1],
    [0],
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        pointerEvents: "none",
        ...style,
      }}
    >
      {rows.map((cols, ri) => (
        <div key={ri} style={{ display: "flex", gap: 5 }}>
          {cols.map((c) => (
            <span
              key={c}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#9EC5E8",
                opacity: 0.7 - c * 0.08,
                display: "block",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * OUR FOCUS page — same ReportPage header/footer/fonts as Key Achievements,
 * with reference layout (sections, bullets, training copy, circular badges).
 */
const OurFocusPage = ({ pageNumber = 2 }) => {
  return (
    <ReportPage className="our-focus-page" pageNumber={pageNumber}>
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
        <DotChevronDecor style={{ top: 40, right: 0, transform: "scaleX(-1)" }} />
        <DotChevronDecor style={{ bottom: 80, left: 0 }} />

        <SectionTitle>OUR FOCUS</SectionTitle>
        <BulletList items={OUR_FOCUS_ITEMS} />

        <SectionTitle style={{ marginTop: 8 }}>Beneficiaries</SectionTitle>
        <BulletList items={BENEFICIARIES_ITEMS} />

        <SectionTitle style={{ marginTop: 8 }}>
          Industry 4.0 Hands-on Training
        </SectionTitle>
        <p style={{ ...bodyText, marginBottom: 12 }}>{TRAINING_DESCRIPTION}</p>
        <ul
          style={{
            margin: "0 0 28px",
            padding: 0,
            listStyle: "none",
          }}
        >
          {[
            "Industry 4.0 production strategies",
            "Skill building through theoretical (in-classroom) and shop-floor experiential learning",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 8,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  border: `2px solid ${BRAND.blue}`,
                  boxSizing: "border-box",
                  flexShrink: 0,
                  marginTop: 6,
                  background: "transparent",
                }}
              />
              <span style={{ ...bodyText, flex: 1 }}>{item}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 36,
            marginTop: "auto",
            paddingTop: 8,
            paddingBottom: 4,
            flexWrap: "wrap",
          }}
        >
          {OUR_FOCUS_BADGES.map((badge) => (
            <div
              key={badge.id}
              style={{
                width: 118,
                height: 118,
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
      </div>
    </ReportPage>
  );
};

export default OurFocusPage;
