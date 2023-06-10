import fs from "fs/promises";
import path from "path";
import * as rdf from "rdflib";

import ClassView from "../../components/ClassView";
import PropertyView from "../../components/PropertyView";
import { Property, Class } from "../../types";

import { BASE_URI, REGEN, RDF, RDFS } from "../../utils/namespaces";

export const generateStaticParams = async () => {
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

  const params = classStatements
    .concat(propertyStatements)
    .map((statement) => ({
      item: statement.subject.value.split("#").pop(),
    }));

  return params;
};

const getItem = async (itemSlug: string) => {
  const filePath = path.join(process.cwd(), "../rdfs", `regen.ttl`);
  const fileContents = await fs.readFile(filePath, "utf8");

  // Parse the RDF data
  const store = rdf.graph();
  rdf.parse(fileContents, store, BASE_URI, "text/turtle");
  const item = REGEN(`${itemSlug}`);

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
      type: "property",
      iri: item.value,
      label,
      description: comment,
      ranges,
      domains,
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
      type: "class",
      iri: item.value,
      label,
      description: comment,
      properties,
    };
  } else {
    throw new Error(`Unhandled type for ${item}`);
  }
};

const ItemPage = async ({ params }: { params: { item: string } }) => {
  const itemSlug = params.item;

  const item = await getItem(itemSlug);
  const componentType = item.type;

  if (componentType === "class") {
    return <ClassView {...(item as Class)} />;
  }
  if (item.type === "property") {
    return <PropertyView {...(item as Property)} />;
  }
};

export default ItemPage;
