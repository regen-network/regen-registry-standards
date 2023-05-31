import { GetStaticProps } from "next";
import { promises as fs } from "fs";
import path from "path";
import * as rdf from "rdflib";
import Link from "next/link";
import styles from "../styles.module.css"; // Import your styles

// Define namespaces
const BASE_URI = "http://schema.regen.network";
const RDF = rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const RDFS = rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
const REGEN = rdf.Namespace(BASE_URI + "#");
const XSD = rdf.Namespace("http://www.w3.org/2001/XMLSchema#");

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), "../rdfs", `regen.ttl`);
  const fileContents = await fs.readFile(filePath, "utf8");

  // Parse the RDF data
  const store = rdf.graph();
  rdf.parse(fileContents, store, BASE_URI, "text/turtle");

  const classStatements = store
    .statementsMatching(undefined, RDF("type"), RDFS("Class"))
    .filter((statement) => statement.subject.value.startsWith(BASE_URI));

  const propertyStatements = store
    .statementsMatching(undefined, RDF("type"), RDF("Property"))
    .filter((statement) => statement.subject.value.startsWith(BASE_URI));

  const classes = classStatements.map((statement) => ({
    id: statement.subject.value.split("#").pop(),
    type: "class",
  }));

  const properties = propertyStatements.map((statement) => ({
    id: statement.subject.value.split("#").pop(),
    type: "property",
  }));

  return {
    props: {
      classes,
      properties,
    },
  };
};

type IndexProps = {
  classes: { id: string; type: string }[];
  properties: { id: string; type: string }[];
};

const IndexPage: React.FC<IndexProps> = ({ classes, properties }) => (
  <div className={styles.container}>
    <p className="mb-6 text-gray-500 text-sm">
      Welcome to the Regen Network schema reference. This goal of this project
      is to standardize a vocabulary for ecological data on Regen Network and
      elsewhere on the web, enabling meaningful, interconnected sharing of
      information. Explore our Classes and Properties below.
    </p>

    <div className={styles.section}>
      <h1 className={styles.title}>Classes</h1>
      <ul className={styles.list}>
        {classes.map(({ id }) => (
          <li key={id}>
            <Link href={`/${id}`}>{id}</Link>
          </li>
        ))}
      </ul>
    </div>

    <div className={styles.section}>
      <h1 className={styles.title}>Properties</h1>
      <ul className={styles.list}>
        {properties.map(({ id }) => (
          <li key={id}>
            <Link href={`/${id}`}>{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default IndexPage;
