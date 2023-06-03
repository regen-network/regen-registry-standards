import * as rdf from "rdflib";

export const BASE_URI = "http://schema.regen.network#";

// Define namespaces
export const RDF = rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
export const RDFS = rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
export const REGEN = rdf.Namespace(BASE_URI);
export const XSD = rdf.Namespace("http://www.w3.org/2001/XMLSchema#");
