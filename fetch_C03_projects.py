#!/usr/bin/env python
import glob
import json
import requests

# API docs for mainnet:
# http://mainnet.regen.network:1317/swagger/#/Query/ProjectsByClass
#
# API docs for registry-server:
# https://api.registry.regen.network/api-docs/


def projects_currently_in_ops():
    return sorted([x for x in glob.glob("ops/C03/project-metadata/*.jsonld")])


def on_chain_projects():
    class_id = "C03"
    resp = requests.get(
        f"http://mainnet.regen.network:1317/regen/ecocredit/v1/projects-by-class/{class_id}"
    )
    resp.raise_for_status()
    projects = resp.json()["projects"]
    return projects


def off_chain_metadata(iri):
    resp = requests.get(f"https://api.registry.regen.network/metadata-graph/{iri}")
    resp.raise_for_status()
    metadata = resp.json()
    return metadata


if __name__ == "__main__":
    current_projects = projects_currently_in_ops()
    tasks = []
    for p in on_chain_projects():
        metadata = off_chain_metadata(p["metadata"])
        project_metadata = f'ops/C03/project-metadata/{p["id"]}-project.jsonld'
        if project_metadata not in current_projects:
            print(
                f"this script will add project metadata into ops: filename={project_metadata} iri={p['metadata']}"
            )
            tasks.append({"filename": project_metadata, "metadata": metadata})
        project_page_metadata = (
            f'ops/C03/project-metadata/{p["id"]}-project-page.jsonld'
        )
        if project_page_metadata not in current_projects:
            print(
                f"this script will create an empty project page: filename={project_page_metadata}"
            )
            tasks.append(
                {
                    "filename": project_page_metadata,
                    "metadata": {},
                }
            )
    if tasks:
        proceed = input("proceed? [y/n] ").lower().strip()
        if proceed == "y":
            for task in tasks:
                with open(task["filename"], "w") as fp:
                    json.dump(task["metadata"], fp)
    else:
        print("there are no C03 projects to sync at this time")
