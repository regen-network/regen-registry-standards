// src/utils/helpers.ts
import Link from "next/link";

const BASE_URL = "http://schema.regen.network#";

const prefixes = {
  xsd: "http://www.w3.org/2001/XMLSchema#",
  schema: "http://schema.org/",
};

export const renderLink = (resource: string) => {
  if (resource.startsWith(BASE_URL)) {
    const name = resource.replace(BASE_URL, "");
    const url = resource.replace(BASE_URL, "/");
    return <Link href={url}>{name}</Link>;
  }
  for (const [prefix, url] of Object.entries(prefixes)) {
    if (resource.startsWith(url)) {
      const name = resource.replace(url, prefix + ":");
      return <Link href={resource}>{name}</Link>;
    }
  }
  return <Link href={resource}>{resource}</Link>;
};

export const parseName = (resource: string) => {
  if (resource.startsWith(BASE_URL)) {
    const name = resource.replace(BASE_URL, "");
    return name;
  } else {
    return resource;
  }
};
