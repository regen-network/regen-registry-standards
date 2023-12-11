// src/utils/helpers.ts
import Link from "next/link";

const BASE_URL = "http://schema.regen.network#";

const prefixes = {
  xsd: "http://www.w3.org/2001/XMLSchema#",
  schema: "http://schema.org/",
};

const parseAttributes = (resource: string): { name: string; url: string } => {
  if (resource.startsWith(BASE_URL)) {
    const name = resource.replace(BASE_URL, "");
    const url = resource.replace(BASE_URL, "/");
    return { name, url };
  }
  for (const [prefix, url] of Object.entries(prefixes)) {
    if (resource.startsWith(url)) {
      const name = resource.replace(url, prefix + ":");
      return { name, url: resource };
    }
  }
  return { name: resource, url: resource };
};

const ResourceLink = ({ resource }: { resource: string }) => {
  const { name, url } = parseAttributes(resource);

  return (
    <Link
      className="text-green-700 border-b-2 border-dotted hover:border-green-700"
      href={url}
    >
      {name}
    </Link>
  );
};

export default ResourceLink;
