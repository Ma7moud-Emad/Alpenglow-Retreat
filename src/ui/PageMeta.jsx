import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SOCIAL_IMAGE,
  absoluteUrl,
} from "../lib/seo";

/**
 * Per-route document metadata.
 *
 * Every route used to share the one <title> and description baked into
 * index.html, so a search result for a cabin and one for the contact page were
 * indistinguishable. This updates the tags that already exist in the document
 * rather than appending new ones, which keeps the head free of duplicates no
 * matter how many times the router moves.
 */

function upsertMeta(attribute, key, content) {
  if (content == null) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default function PageMeta({
  /** Page name on its own. The site name is appended; omit it for the home page. */
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = SOCIAL_IMAGE,
  type = "website",
  noIndex = false,
  schema = null,
}) {
  const documentTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = absoluteUrl(path);
  // Objects built inline in JSX are a new reference every render; comparing the
  // serialised form keeps the script tag from being torn down needlessly.
  const serialisedSchema = schema ? JSON.stringify(schema) : null;

  useEffect(() => {
    document.title = documentTitle;

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );
    upsertLink("canonical", url);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", documentTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", documentTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
  }, [documentTitle, description, url, image, type, noIndex]);

  useEffect(() => {
    if (!serialisedSchema) return undefined;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = serialisedSchema;
    document.head.appendChild(script);

    return () => script.remove();
  }, [serialisedSchema]);

  return null;
}
