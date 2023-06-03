import { Class } from "../types";
import View from "./View";
import PropertiesTable from "./PropertiesTable";

const ClassView = ({ iri, label, description, properties }: Class) => {
  return (
    <View
      resource={iri}
      subtitle="an rdf:Class"
      label={label}
      description={description}
    >
      <div className="mt-4">
        <PropertiesTable properties={properties} />
      </div>
    </View>
  );
};

export default ClassView;
