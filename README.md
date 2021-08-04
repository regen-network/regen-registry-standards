# Regen Registry Standards

This repository contains:
- Source schema for Regen Network ontology (TODO)
- [SHACL](https://www.w3.org/TR/shacl/) schemas for:
  - Registry projects and dMRV form validation
  - Methodology, credit class and credit vintage metadata validation (TODO)

## SHACL Graphs

The `shacl` folder contains SHACL schemas for validating data (for example, project related data), using [Turtle](https://www.w3.org/TR/turtle/) or [JSON-LD](https://json-ld.org/).

These graphs can be stored too in the PostGres database in the `schacl_graph` table in order to be queried using GraphQL and used for client-side validation.
The `schacl_graph` table has an `uri` as primary key and a jsonb column `graph` where a SCHACL graph is encoded as JSON-LD.
For instance, an entry with `http://regen.network/ProjectPlanShape` as URI can be created to store the SHACL graph to validate a [project plan](./schema/project-plan.ttl).
