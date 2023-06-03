import { BASE_URI } from "./namespaces";

export const parseName = (resource: string) => {
  if (resource.startsWith(BASE_URI)) {
    const name = resource.replace(BASE_URI, "");
    return name;
  } else {
    return resource;
  }
};
