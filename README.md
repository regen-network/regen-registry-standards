# Regen Registry Standards

This repository contains:
- Source schema for Regen Network ontology (TODO)
- [SHACL](https://www.w3.org/TR/shacl/) schemas for:
  - Registry projects and dMRV form validation
  - Methodology, credit class, project, credit vintage and retirement metadata validation

## SHACL Graphs

The `shacl` folder contains SHACL schemas for validating data (for example, project related data), using [Turtle](https://www.w3.org/TR/turtle/) or [JSON-LD](https://json-ld.org/).

## JSON-LD Examples

The `jsonld` folder contains examples of JSON-LD data that can be directly copied/pasted and filled in (filling in empty strings and replacing `0` with appropriate numbers). Corresponding SHACL graphs can be found in the `shacl` folder.

## Validating our schemas

We can make use of the apache jena software's shacl CLI to parse and
validate the RDF graphs in this repository.

https://jena.apache.org/documentation/shacl/index.html

If you are on Mac you can install jena with homebrew (`brew install jena`).
There is a lot of info in the jena documentation about supported
RDF-formats:

https://jena.apache.org/documentation/io/
