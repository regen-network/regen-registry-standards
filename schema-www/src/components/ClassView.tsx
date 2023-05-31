import { Class, Property } from "../types";
import InfoBox from "./InfoBox";
import { renderLink, parseName } from "../utils/helpers";
import styles from "../styles.module.css";

const ClassComponent: React.FC<Class> = ({
  iri,
  label,
  description,
  properties,
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{parseName(iri)}</h1>
      <h2 className={styles.subtitle}>An rdfs:Class</h2>
      <InfoBox label={parseName(iri)} iri={iri} />
      <p className={styles.text}>{description}</p>
      <div className="mt-4">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Property</th>
              <th>Expected Types</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop: Property, i: number) => {
              return (
                <tr key={i}>
                  <td className="font-mono">{renderLink(prop.label)}</td>
                  <td>{renderLink(prop.ranges[0])} </td>
                  <td>{prop.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassComponent;
