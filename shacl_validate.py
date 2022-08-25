#!/usr/bin/env python3
import glob
from shutil import which
import sys
from subprocess import check_output

# If the script exits with a non-zero status code there was at least one failed
# SHACL validation. This can be used to mark a CI check as failed.
EXIT_CODE = 0


def shacl_validate(shapes, data):
    global EXIT_CODE
    result = check_output(
        f"shacl validate --text --shapes={shapes} --data={data}".split(),
        encoding="utf-8",
    ).strip()
    if result == "Conforms":
        print(f"shapes={shapes} data={data} result=CONFORMS")
        return True
    EXIT_CODE = 1
    full_result = check_output(
        f"shacl validate --shapes={shapes} --data={data}".split(), encoding="utf-8"
    ).strip()
    print(f"shapes={shapes} data={data} result=INVALID")
    print(full_result)
    return False


def credit_class_validations():
    for data in glob.iglob("ops/C01/credit-class-metadata/*.jsonld"):
        shacl_validate(
            "shacl/credit-classes/C01-verified-carbon-standard-class.ttl",
            data, 
        )


def project_validations():
    for data in glob.iglob("ops/C01/project-metadata/*.jsonld"):
        shacl_validate(
            "shacl/projects/C01-verified-carbon-standard-project.ttl",
            data, 
        )


def credit_batch_validations():
    for data in glob.iglob("ops/C01/credit-batch-metadata/*.jsonld"):
        shacl_validate(
            "shacl/credit-batches/C01-verified-carbon-standard-batch.ttl",
            data, 
        )


if __name__ == "__main__":
    if not which("shacl"):
        print("Please install the apache jena shacl cli tool.")
        print("See https://jena.apache.org/documentation/shacl/index.html")
        print("For mac: https://formulae.brew.sh/formula/jena")
        print("Install Docs: https://jena.apache.org/download/index.cgi")
        sys.exit(1)
    credit_class_validations()
    project_validations()
    credit_batch_validations()
    sys.exit(EXIT_CODE)
