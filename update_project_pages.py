#!/usr/bin/env python
import os
import glob
import json
from sqlalchemy import create_engine, text

url = os.getenv(
    "DB_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/regen_registry"
)
print(f"DB_URL={url}")
if not url.startswith("postgresql+psycopg2://"):
    raise Exception("invalid db url")

files = sorted(glob.glob("ops/C05/project-metadata/*-project-page.jsonld"))

updates = []
for file in files:
    on_chain_id = file.split("-project-page.jsonld")[0].split("/")[-1]
    with open(file, "r") as fp:
        metadata = json.dumps(json.load(fp))
    print(f"project.metadata for project.{on_chain_id=} will be updated with {file=}")
    updates.append({"metadata": metadata, "on_chain_id": on_chain_id})

engine = create_engine(url, echo=True)
with engine.connect() as conn:
    q = text(
        "UPDATE project SET metadata=:metadata, updated_at=now() WHERE on_chain_id=:on_chain_id"
    )
    res = conn.execute(
        q,
        updates,
    )
    print(len(files), "project page metadata files were loaded..")
    print(res.rowcount, "rows will be updated after commit..")
    c = input("commit? [y/n] ").lower().strip()
    if c == "y":
        conn.commit()