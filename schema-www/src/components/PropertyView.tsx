import { Property } from "../types";
import ResourceLink from "./ResourceLink";
import View from "./View";

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
    <div className="mt-4">
      <h2 className="text-gray-700 font-bold mb-2 text-base">
        Values expected to be one of these types:
      </h2>
      <ul className="list-disc ml-5">
        {ranges.map((range, i) => (
          <li key={i}>
            <ResourceLink resource={range} />
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-4">
      <h2 className="text-gray-700 font-bold mb-2 text-base">
        Used on these types:
      </h2>
      <ul className="list-disc ml-5">
        {domains.map((domain, i) => (
          <li key={i}>
            <ResourceLink resource={domain} />
          </li>
        ))}
      </ul>
    </div>
  </View>
);

export default PropertyView;
