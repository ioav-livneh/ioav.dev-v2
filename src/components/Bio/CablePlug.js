import React from "react";

// Two-prong power plug drawn at the end of the cable: strain relief, plug
// body with grip lines, then the two bare prongs. 24×36 (see CABLE_PLUG_HEIGHT
// in PowerCable.js and .Bio-cable-plug in Bio.css).
const CablePlug = () => (
  <svg className="Bio-cable-plug" viewBox="0 0 24 36" focusable="false">
    <rect className="plug-relief" x="9" y="0" width="6" height="7" rx="1.5" />
    <rect className="plug-body" x="3" y="6" width="18" height="20" rx="4" />
    <rect className="plug-grip" x="6" y="10" width="12" height="1.6" rx="0.8" />
    <rect className="plug-grip" x="6" y="13.5" width="12" height="1.6" rx="0.8" />
    <rect className="plug-prong" x="7" y="26" width="3" height="10" rx="0.8" />
    <rect className="plug-prong" x="14" y="26" width="3" height="10" rx="0.8" />
  </svg>
);

export default CablePlug;
