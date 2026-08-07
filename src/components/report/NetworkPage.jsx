import React from "react";
import ReportPage from "./ReportPage";
import IndiaNetworkMap from "./IndiaNetworkMap";
import { BRAND, NETWORK_DESCRIPTION } from "../../constants/reportConstants";

const FONT =
  "'Segoe UI', Roboto, Montserrat, Arial, Helvetica, sans-serif";

/**
 * i-Factory Network page — report fonts for intro text;
 * India map uses the exact reference artwork.
 */
const NetworkPage = ({ pageNumber = 1 }) => {
  return (
    <ReportPage className="network-page" pageNumber={pageNumber}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            padding: "20px 28px 22px",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 36,
              fontWeight: 800,
              color: BRAND.blue,
              letterSpacing: 0.3,
              fontFamily: FONT,
            }}
          >
            i-Factory Network
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.7,
              color: BRAND.gray,
              fontFamily: FONT,
            }}
          >
            {NETWORK_DESCRIPTION}
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 0,
            // padding: "4px 0 0",
          }}
        >
          <IndiaNetworkMap />
        </div>
      </div>
    </ReportPage>
  );
};

export default NetworkPage;
