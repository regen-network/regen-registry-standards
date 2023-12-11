import InfoBox from "./InfoBox";
import { parseName } from "../utils/helpers";

type ViewProps = {
  resource: string;
  subtitle: string;
  label: string;
  description: string;
  children: React.ReactNode;
};

const View = ({ resource, subtitle, description, children }: ViewProps) => (
  <div className="p-6 bg-gray-100">
    <h1 className="text-3xl font-bold mb-2 text-green-700">
      {parseName(resource)}
    </h1>
    <h2 className="text-gray-500 italic text-sm mt-1 mb-1">{subtitle}</h2>
    <InfoBox label={parseName(resource)} iri={resource} />
    <p className="text-gray-700 text-base">{description}</p>
    <div className="mt-4">{children}</div>
  </div>
);

export default View;
