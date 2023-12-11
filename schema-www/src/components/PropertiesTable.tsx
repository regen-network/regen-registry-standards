import { Property } from "../types";
import ResourceLink from "./ResourceLink";

type PropertiesTableProps = {
  properties: Property[];
};

const HeaderCell = ({ text }: { text: string }) => (
  <th className="px-4 py-2 border border-gray-300">{text}</th>
);

const TableCell = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`px-4 py-2 border border-gray-300 ${className}`}>
    {children}
  </td>
);

const PropertiesTable = ({ properties }: PropertiesTableProps) => (
  <table className="table-auto w-full text-left text-gray-700 border border-gray-300">
    <thead>
      <tr>
        <HeaderCell text="Property" />
        <HeaderCell text="Expected Types" />
        <HeaderCell text="Description" />
      </tr>
    </thead>
    <tbody>
      {properties.map((prop: Property) => (
        <tr key={prop.label}>
          <TableCell className="font-mono">
            <ResourceLink resource={prop.label} />
          </TableCell>
          <TableCell>
            <ResourceLink resource={prop.ranges[0]} />
          </TableCell>
          <TableCell>{prop.description}</TableCell>
        </tr>
      ))}
    </tbody>
  </table>
);

export default PropertiesTable;
