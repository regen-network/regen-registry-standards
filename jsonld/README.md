# The `jsonld` folder

## Layout

### Empty templates

We maintain a list of empty templates for JSON-LD.
These folders contain the empty templates.

- `credit-batches`
- `credit-classes`
- `projects`

### Example data for validation purposes

We maintain some folders that contain data for validation.
Typically validation checks are run against the data in the `ops` folder.
However, for some cases like C03 (Toucan) we need to maintain separate data graphs for validation.
These folders contain data graphs for validation.

- `C03`

For C03 metadata, this metadata is created dynamically by the toucan-bridge-service.
Unlike C01/C02 metadata, we cannot easily track this data in version control.

See the `shacl_validate.py` script for more info.
I.e. how the data graphs are loaded and validated in this repo.
