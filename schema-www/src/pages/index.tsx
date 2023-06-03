import { GetStaticProps } from "next";
import { promises as fs } from "fs";
import path from "path";
import * as rdf from "rdflib";

import ResourceLink from "../components/ResourceLink";

import { BASE_URI, RDF, RDFS } from "../utils/namespaces";

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

  const classes = classStatements.map((statement) => statement.subject.value);

  const properties = propertyStatements.map(
    (statement) => statement.subject.value
  );

  return {
    props: {
      classes,
      properties,
    },
  };
};

type IndexProps = {
  classes: string[];
  properties: string[];
};

const Resources = ({
  title,
  resources,
}: {
  title: string;
  resources: string[];
}) => {
  return (
    <div className="bg-white p-4 my-4 border border-gray-200 rounded shadow">
      <h2 className="text-2xl pb-2 font-semibold text-gray-700"> {title}</h2>
      <ul className="list-disc ml-5">
        {resources.map((resource) => (
          <li key={resource}>
            <ResourceLink resource={resource} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const IndexPage = ({ classes, properties }: IndexProps) => (
  <div className="p-6 bg-gray-100">
    <p className="mb-6 text-gray-500 text-sm">
      Welcome to the Regen Network schema reference. This goal of this project
      is to standardize a vocabulary for ecological data on Regen Network and
      elsewhere on the web, enabling meaningful, interconnected sharing of
      information. Explore our Classes and Properties below.
    </p>

    <Resources title="Classes" resources={classes} />
    <Resources title="Properties" resources={properties} />
  </div>
);

export default IndexPage;
