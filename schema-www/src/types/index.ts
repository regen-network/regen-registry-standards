export interface Property {
  type: "property";
  iri: string;
  label: string;
  description: string;
  ranges: string[];
  domains: string[];
}
export interface Class {
  type: "class";
  iri: string;
  label: string;
  description: string;
  properties: Property[];
}
