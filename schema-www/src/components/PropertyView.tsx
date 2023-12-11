import { Property } from "../types";
import ResourceLink from "./ResourceLink";
import View from "./View";

type ResourcesListProps = {
  resources: string[];
  children: React.ReactNode;
};

const ResourcesList = ({ resources, children }: ResourcesListProps) => (
  <div className="mt-4">
    <h2 className="text-gray-700 font-bold mb-2 text-base">{children}</h2>
    <ul className="list-disc ml-5">
      {resources.map((range) => (
        <li key={range}>
          <ResourceLink resource={range} />
        </li>
      ))}
    </ul>
  </div>
);

const PropertyView = ({
  iri,
  label,
  description,
  ranges,
  domains,
}: Property) => (
  <View
    resource={iri}
    subtitle="an rdf:Property"
    label={label}
    description={description}
  >
    <ResourcesList resources={ranges}>
      Values expected to be one of these types:
    </ResourcesList>
    <ResourcesList resources={domains}>Used on these types:</ResourcesList>
  </View>
);

export default PropertyView;
