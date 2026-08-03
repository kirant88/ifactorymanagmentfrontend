import React from "react";
import indiaNetworkMap from "../../assets/pdfimages/india-network-map.png";

/**
 * India network map — exact PDF/reference artwork
 * (pins, dashed callouts, state fills, corner dots).
 */
const IndiaNetworkMap = () => (
  <img
    src={indiaNetworkMap}
    alt="i-Factory Network locations across India"
    style={{
      width: "100%",
      maxWidth: 800,
      height: "auto",
      maxHeight: 800,
      objectFit: "contain",
      display: "block",
      margin: "0 auto",
    }}
  />
);

export default IndiaNetworkMap;
