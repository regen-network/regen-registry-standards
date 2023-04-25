# Regen Registry Standards

This repository contains:
- Source schema for Regen Network ontology (TODO)
- [SHACL][6] schemas for:
  - Registry projects and dMRV form validation
  - Methodology, credit class, project, credit vintage and retirement metadata
    validation

## SHACL Graphs

The `shacl` folder contains SHACL schemas for validating data (for example,
project related data), using [Turtle][4] or
[JSON-LD][5].

## JSON-LD Examples

The `jsonld` folder contains examples of JSON-LD data that can be directly
copied/pasted and filled in (filling in empty strings and replacing `0` with
appropriate numbers). Corresponding SHACL graphs can be found in the `shacl`
folder.

## Live metadata

The `ops` folder contains the metadata for all projects, credit classes and
credit batches live on Regen Ledger. These can be validated with the SHACL
graphs in this repository. See the "Validation" section below. 

## Validation

Dependencies:

1. The [Apache Jena SHACL CLI][1] (`brew install jena` or use your package
   manager or [official install][2])
2. A working `python3` installation (`brew install python` or use your package
   manager or [official install][3])

Running validations:

```
$ ./shacl_validate.py
```

## Update project pages

```
$ python3 -m venv venv
$ . venv/bin/activate
(venv) $ pip install sqlalchemy psycopg2
(venv) $ DB_URL='postgresql+psycopg2://postgres:postgres@localhost:5432/regen_registry' ./update_project_pages.py
```

[1]: https://jena.apache.org/documentation/shacl/index.html
[2]: https://jena.apache.org/download/index.cgi
[3]: https://www.python.org/downloads/
[4]: https://www.w3.org/TR/turtle/
[5]: https://json-ld.org/
[6]: https://www.w3.org/TR/shacl/ 
