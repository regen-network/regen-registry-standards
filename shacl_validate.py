#!/usr/bin/env python3
import argparse
import glob
import sys
from shutil import which
from subprocess import STDOUT, CalledProcessError, check_output
from tempfile import NamedTemporaryFile

# If the script exits with a non-zero status code there was at least one failed
# SHACL validation. This can be used to mark a CI check as failed.
EXIT_CODE = 0
CMD_SHACL_VALIDATE = "shacl validate --text --shapes={shapes} --data={data}"


def shacl_validate(shapes, data):
    global EXIT_CODE
    try:
        result = check_output(
            CMD_SHACL_VALIDATE.format(shapes=shapes, data=data).split(),
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


def credit_class_validations(fp, class_id=None):
    if class_id is None:
        glob_string = "*/*/credit-class-metadata/*.jsonld"
    else:
        glob_string = f"*/{class_id}/credit-class-metadata/*.jsonld"

    for data in sglob(glob_string):
        shacl_validate(
            fp.name,
            data,
        )


def project_validations(fp, class_id=None):
    if class_id is None:
        glob_string = "*/*/project-metadata/*.jsonld"
    else:
        glob_string = f"*/{class_id}/project-metadata/*.jsonld"

    for data in sglob(glob_string):
        shacl_validate(
            fp.name,
            data,
        )


def credit_batch_validations(fp, class_id=None):
    if class_id is None:
        glob_string = "*/*/credit-batch-metadata/*.jsonld"
    else:
        glob_string = f"*/{class_id}/credit-batch-metadata/*.jsonld"

    for data in sglob(glob_string):
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

    parser = argparse.ArgumentParser(
        prog="shacl_validate",
        description="A tool for validating SHACL schema against regen-registry-standards JSON-LD data graphs",
    )
    parser.add_argument(
        "--build-schema-file-only",
        help="Only build the schema file",
        action="store_true",
    )
    parser.add_argument(
        "--print-shacl-validate-cmd-only",
        help="Only print the shacl validate cmd template string.",
        action="store_true",
    )
    parser.add_argument(
        "--credit-class-only",
        help="Only validate credit class data",
        action="store_true",
    )
    parser.add_argument(
        "--project-only",
        help="Only validate project data",
        action="store_true",
    )
    parser.add_argument(
        "--credit-batch-only",
        help="Only validate credit batch data",
        action="store_true",
    )
    parser.add_argument("--class-id", help="Only run validations for a particular class id")
    args = parser.parse_args()

    if args.build_schema_file_only:
        with open("regen-registry-schema.ttl", "w") as fp:
            build_schema_file(fp)
        sys.exit(EXIT_CODE)

    if args.print_shacl_validate_cmd_only:
        print(CMD_SHACL_VALIDATE)
        sys.exit(EXIT_CODE)

    with NamedTemporaryFile("w", suffix=".ttl") as fp:
        build_schema_file(fp)
        
        if args.credit_class_only:
            credit_class_validations(fp, class_id=args.class_id)
            sys.exit(EXIT_CODE)
        if args.project_only:
            project_validations(fp, class_id=args.class_id)
            sys.exit(EXIT_CODE)
        if args.credit_batch_only:
            credit_batch_validations(fp, class_id=args.class_id)
            sys.exit(EXIT_CODE)

        # by default, validate all data
        credit_class_validations(fp, class_id=args.class_id)
        project_validations(fp, class_id=args.class_id)
        credit_batch_validations(fp, class_id=args.class_id)

    sys.exit(EXIT_CODE)
