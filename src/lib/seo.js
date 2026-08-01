/**
 * Everything the pages need to describe themselves to search engines and to
 * anything that unfurls a link.
 *
 * One caveat worth knowing: this is a client-rendered app, so the tags below
 * are written after JavaScript runs. Google renders JavaScript and will see
 * them; the social scrapers (Facebook, LinkedIn, WhatsApp, X) do not, and fall
 * back to whatever is hard-coded in index.html. That is why index.html carries
 * a complete set of home-page defaults rather than placeholders.
 */

export const SITE_NAME = "Alpenglow Retreat";

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://alpenglow-retreat.vercel.app"
).replace(/\/+$/, "");

export const SOCIAL_IMAGE = `${SITE_URL}/og-cover.jpg`;

export const DEFAULT_DESCRIPTION =
  "Fifteen cabins on four hundred acres of pine, meadow and lakeshore. Wood " +
  "fires, cedar hot tubs and one of the darkest skies in the region. Open all year.";

export const CONTACT = {
  phone: "+15550142200",
  email: "stay@alpenglow.test",
  street: "Vale Road",
  locality: "Pine Hollow",
};

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** The estate itself. Rendered on the home page. */
export function lodgingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Resort",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: SOCIAL_IMAGE,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    numberOfRooms: 15,
    petsAllowed: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.locality,
    },
    amenityFeature: [
      "Wood-burning stove in every cabin",
      "Outdoor cedar hot tubs",
      "Wood-fired lakeside sauna",
      "Fibre Wi-Fi to every cabin",
      "Breakfast delivered to the door",
      "Four hundred acres of marked trails",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };
}

/** One cabin, with its nightly rate. Rendered on a room detail page. */
export function roomSchema(room) {
  const nightly = Number(room.regularPrice) - Number(room.discount ?? 0);

  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.tagline || room.description?.slice(0, 300),
    url: absoluteUrl(`/rooms/${room.slug}`),
    image: room.image || SOCIAL_IMAGE,
    bed: room.bed_type || undefined,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxCapacity,
      unitText: "guests",
    },
    floorSize: room.size_sqm
      ? { "@type": "QuantitativeValue", value: room.size_sqm, unitCode: "MTK" }
      : undefined,
    containedInPlace: { "@type": "Resort", name: SITE_NAME, url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: nightly,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/rooms/${room.slug}`),
    },
  };
}

/** `trail` is [{ name, path }], ending with the current page. */
export function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
