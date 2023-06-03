import { Property } from "../types";
import ResourceLink from "./ResourceLink";

type PropertiesTableProps = {
  properties: Property[];
};

const PropertiesTable = ({ properties }: PropertiesTableProps) => (
  <table className="table-auto w-full text-left text-gray-700 border border-gray-300">
    <thead>
      <tr>
        <th className="px-4 py-2 border border-gray-300">Property</th>
        <th className="px-4 py-2 border border-gray-300">Expected Types</th>
        <th className="px-4 py-2 border border-gray-300">Description</th>
      </tr>
    </thead>
    <tbody>
      {properties.map((prop: Property, i: number) => (
        <tr key={i}>
          <td className="px-4 py-2 border border-gray-300 font-mono">
            <ResourceLink resource={prop.label} />
          </td>
          <td className="px-4 py-2 border border-gray-300">
            <ResourceLink resource={prop.ranges[0]} />
          </td>
          <td className="px-4 py-2 border border-gray-300">
            {prop.description}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default PropertiesTable;
