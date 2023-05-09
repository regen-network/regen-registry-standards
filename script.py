#!/usr/bin/env python
import glob
import json
import re
import requests

files = sorted(glob.glob("ops/*/project-metadata/C03-*-project.jsonld"))
RE = re.compile("C03-([0-9]+)")

for file in files:
    if int(RE.findall(file)[0]) >= 8:
        with open(file, "r") as fp:
            metadata = json.load(fp)
        resp = requests.post(
            "https://api.registry.regen.network/iri-gen", json=metadata
        )
        resp.raise_for_status()
        iri = resp.json()["iri"]
        print(f"{file=} {iri=}")
