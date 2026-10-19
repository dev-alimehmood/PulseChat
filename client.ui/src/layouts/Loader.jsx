import React from "react";
import PulseLoader from "../components/shared/PulseLoader";

/**
 * Standard Application Loader — delegates to thematic PulseLoader
 */
const Loader = ({ message = "Loading...", fullscreen = true }) => {
  return (
    <PulseLoader
      variant={fullscreen ? "fullscreen" : "page"}
      message={message}
      size="md"
      showCard={true}
    />
  );
};

export default Loader;
