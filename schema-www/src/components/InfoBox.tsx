"use client";

import React, { useState } from "react";

interface InfoBoxProps {
  label: string;
  iri: string;
}

const InfoBox = ({ label, iri }: InfoBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="mt-2 mb-2 text-xs font-bold cursor-pointer"
      >
        {isExpanded ? "▲ [more...]" : "▼ [more...]"}
      </button>
      {isExpanded && (
        <div className="p-4 mb-2 border border-gray-300 rounded text-sm bg-gray-200">
          <p>Canonical URL: {iri}</p>
          <a
            href={`https://github.com/regen-network/regen-registry-standards/issues?q=is%3Aissue+is%3Aopen+${label}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check for open issues on Github
          </a>
        </div>
      )}
    </>
  );
};

export default InfoBox;
