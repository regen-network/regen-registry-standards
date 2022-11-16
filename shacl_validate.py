#!/usr/bin/env python3
import glob
from shutil import which
import sys
from subprocess import check_output, CalledProcessError, STDOUT
from tempfile import NamedTemporaryFile

# If the script exits with a non-zero status code there was at least one failed
# SHACL validation. This can be used to mark a CI check as failed.
EXIT_CODE = 0


def shacl_validate(shapes, data):
    global EXIT_CODE
    try:
        result = check_output(
            f"shacl validate --text --shapes={shapes} --data={data}".split(),
            encoding="utf-8",
            stderr=STDOUT,
        ).strip()
    except CalledProcessError as exc:
        print(f"shapes={shapes} data={data} result=ERROR")
        print(exc.stdout)
        return False
    if result == "Conforms":
        print(f"shapes={shapes} data={data} result=CONFORMS")
        return True
    EXIT_CODE = 1
    print(f"shapes={shapes} data={data} result=INVALID")
    full_result = check_output(
        f"shacl validate --shapes={shapes} --data={data}".split(),
        encoding="utf-8",
    ).strip()
    print(full_result)
    return False


def sglob(pathname):
    return sorted(glob.iglob(pathname))


def credit_class_validations(fp):
    for data in sglob("*/*/credit-class-metadata/*.jsonld"):
        shacl_validate(
            fp.name,
            data,
        )


def project_validations(fp):
    for data in sglob("*/*/project-metadata/*.jsonld"):
        shacl_validate(
            fp.name,
            data,
        )


def credit_batch_validations(fp):
    for data in sglob("*/*/credit-batch-metadata/*.jsonld"):
        shacl_validate(
            fp.name,
            data,
        )


def build_schema_file(fp):
    files = " ".join(
        check_output(
            'find shacl -name "*.ttl"',
            encoding="utf-8",
            shell=True,
        ).split()
    )
    cmd = f"riot --output=turtle {files}"
    schema = check_output(cmd, encoding="utf-8", shell=True)
    fp.write(schema)
    return


if __name__ == "__main__":
    if not which("shacl") or not which("riot"):
        print("Please install the apache jena shacl cli tool.")
        print("See https://jena.apache.org/documentation/shacl/index.html")
        print("For mac: https://formulae.brew.sh/formula/jena")
        print("Install Docs: https://jena.apache.org/download/index.cgi")
        sys.exit(1)
    with NamedTemporaryFile("w", suffix=".ttl") as fp:
        build_schema_file(fp)
        credit_class_validations(fp)
        project_validations(fp)
        credit_batch_validations(fp)
        sys.exit(EXIT_CODE)
