import { Property } from "../types";
import InfoBox from "./InfoBox";
import { renderLink, parseName } from "../utils/helpers";
import styles from "../styles.module.css";

const PropertyView: React.FC<Property> = ({
  iri,
  label,
  description,
  ranges,
  domains,
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{parseName(iri)}</h1>
      <h2 className={styles.subtitle}>An rdf:Property</h2>
      <InfoBox label={parseName(iri)} iri={iri} />
      <p className={styles.text}>{description}</p>
      <div className="mt-4">
        <h2 className={styles.ulHeader}>
          Values expected to be one of these types:
        </h2>
        <ul className={styles.list}>
          {ranges.map((range, i) => {
            return <li key={i}>{renderLink(range)}</li>;
          })}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className={styles.ulHeader}>Used on these types:</h2>
        <ul className={styles.list}>
          {domains.map((domain, i) => {
            return <li key={i}>{renderLink(domain)}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default PropertyView;
