import React, { useState } from "react";
import styles from "../styles.module.css";

interface InfoBoxProps {
  label: string;
  iri: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, iri }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button onClick={handleToggle} className={styles.expandButton}>
        {isExpanded ? "▲ [more...]" : "▼ [more...]"}
      </button>
      {isExpanded && (
        <div className={styles.infoBox}>
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
