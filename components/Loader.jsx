import React from "react";

const Loader = ({ children }) => {
  return (
    <div className="fullscreen-overlay">
      <div className="spinner-large"></div>
      <div className="loading-message">{children}</div>
    </div>
  );
};

export default Loader;
