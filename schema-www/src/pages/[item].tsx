import { GetStaticPaths, GetStaticProps } from "next";
import styles from "../styles.module.css";

import { ParsedUrlQuery } from "querystring";
import { promises as fs } from "fs";
import path from "path";
import * as rdf from "rdflib";

import ClassView from "../components/ClassView";
import PropertyView from "../components/PropertyView";
import { Property, Class } from "../types";

// Define namespaces
const BASE_URI = "http://schema.regen.network";
const RDF = rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const RDFS = rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
const REGEN = rdf.Namespace(BASE_URI + "#");
const XSD = rdf.Namespace("http://www.w3.org/2001/XMLSchema#");

interface Params extends ParsedUrlQuery {
  item: string | undefined;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
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

  const paths = classStatements.concat(propertyStatements).map((statement) => ({
    params: { item: statement.subject.value.split("#").pop() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{}, Params> = async ({
  params,
}) => {
  if (!params) throw new Error("Missing params");

  const filePath = path.join(process.cwd(), "../rdfs", `regen.ttl`);
  const fileContents = await fs.readFile(filePath, "utf8");

  // Parse the RDF data
  const store = rdf.graph();
  rdf.parse(fileContents, store, BASE_URI, "text/turtle");
  const item = REGEN(`${params.item}`);

  const itemType = store.any(item, RDF("type"));
  if (!itemType) throw new Error(`No type found for ${item}`);

  if (itemType.value == RDF("Property").value) {
    // Fetch property data
    const label = store.any(item, RDFS("label"))?.value;
    const comment = store.any(item, RDFS("comment"))?.value;
    const ranges = store
      .statementsMatching(item, RDFS("range"), undefined)
      .map((statement) => statement.object.value);
    const domains = store
      .statementsMatching(item, RDFS("domain"), undefined)
      .map((statement) => statement.object.value);

    return {
      props: {
        item: {
          type: "property",
          iri: item.value,
          label,
          description: comment,
          ranges,
          domains,
        },
      },
    };
  } else if (itemType.value == RDFS("Class").value) {
    // Fetch class data
    const label = store.any(item, RDFS("label"))?.value;
    const comment = store.any(item, RDFS("comment"))?.value;
    const properties = store
      .statementsMatching(undefined, RDFS("domain"), item)
      .map((statement) => {
        const label = statement.subject.value;
        const ranges = store
          .statementsMatching(statement.subject, RDFS("range"), undefined)
          .map((propRange) => {
            return propRange.object.value;
          });
        const description = store.any(
          statement.subject,
          RDFS("comment")
        )?.value;
        return { type: "property", label, ranges, description };
      });

    return {
      props: {
        item: {
          type: "class",
          iri: item.value,
          label,
          description: comment,
          properties,
        },
      },
    };
  } else {
    throw new Error(`Unhandled type for ${item}`);
  }
};

type ItemProps = {
  item: Property | Class;
};

const SchemaPage: React.FC<ItemProps> = ({ item }) => {
  if (item.type === "class") {
    return <ClassView {...item} />;
  } else if (item.type === "property") {
    return <PropertyView {...item} />;
  } else {
    return (
      <div className={styles.error}>
        <h1 className={styles.title}>Error: Invalid schema type</h1>
        <p className={styles.text}>
          The provided schema type is not recognized. Please ensure it is either
          &quot;class&quot; or &quot;property&quot;.
        </p>
      </div>
    );
  }
};

export default SchemaPage;
