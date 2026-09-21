import type { Metadata } from "next";

// Default SEO configuration (migrated from lib/seo.js / components/SEO.js)
export const SITE_URL = "https://www.rmhsagulu.com";
export const SITE_NAME = "Rosa Mystica High School";
export const TWITTER_HANDLE = "@rosamysticahsa";

export const DEFAULT_TITLE =
  "Rosa Mystica High School - Excellence in Education Since 1966";

export const DEFAULT_DESCRIPTION =
  "Welcome to Rosa Mystica High School, Agulu. Explore our academics, athletics, and facilities. Join us in shaping the future of education with our state-of-the-art facilities and inspiring faculty.";

export const DEFAULT_KEYWORDS =
  "Rosa Mystica High School, Agulu, Nigeria, Secondary School, Education, Catholic School, Academic Excellence, Boarding School, Anambra State";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/RMHS.jpg`;

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "Rosa Mystica High School - Excellence in Education Since 1966",
    description:
      "Welcome to Rosa Mystica High School, Agulu. Explore our academics, athletics, and facilities. Join us in shaping the future of education with our state-of-the-art facilities and inspiring faculty.",
    canonical: "https://www.rmhsagulu.com",
  },
  about: {
    title: "About Us - Rosa Mystica High School | Our History & Mission",
    description:
      "Learn about Rosa Mystica High School's rich history since 1966, our mission, values, and commitment to academic excellence. Discover our state-of-the-art facilities and inspiring faculty.",
    canonical: "https://www.rmhsagulu.com/about",
  },
  admission: {
    title: "Admission - Apply to Rosa Mystica High School | Join Our Community",
    description:
      "Apply to Rosa Mystica High School and join our community of change-makers. Learn about our admission process, requirements, and how to become part of our legacy of excellence.",
    canonical: "https://www.rmhsagulu.com/admission",
  },
  contact: {
    title: "Contact Us - Rosa Mystica High School | Get in Touch",
    description:
      "Contact Rosa Mystica High School for admissions, tours, or general inquiries. Located in Agulu, Anambra State. Phone: +234-8076367903 | Email: rosamysticahsa@gmail.com",
    canonical: "https://www.rmhsagulu.com/contactUs",
  },
  gallery: {
    title: "Gallery - Rosa Mystica High School | Campus Life & Facilities",
    description:
      "Explore our campus through photos showcasing state-of-the-art facilities, student life, academic programs, and extracurricular activities at Rosa Mystica High School.",
    canonical: "https://www.rmhsagulu.com/gallery",
  },
  "school-life": {
    title: "School Life - Rosa Mystica High School | Student Experience",
    description:
      "Discover student life at Rosa Mystica High School. Learn about our academic programs, extracurricular activities, sports, and vibrant campus community.",
    canonical: "https://www.rmhsagulu.com/school-life",
  },
  "give-to-RMHS": {
    title: "Support Rosa Mystica High School | Donate & Give Back",
    description:
      "Support Rosa Mystica High School's mission of educational excellence. Your donations help us provide quality education and maintain our state-of-the-art facilities.",
    canonical: "https://www.rmhsagulu.com/give-to-RMHS",
  },
} as const;

export type PageKey = keyof typeof pageSEO;

export interface MetadataOptions {
  title: string;
  description: string;
  /** Route path used for canonical/og:url, e.g. "/about". Defaults to the site root. */
  path?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds a complete Metadata object for a route (replaces the old
 * next-seo <SEO /> component logic: title, description, canonical,
 * robots, Open Graph, Twitter and keywords).
 */
export function buildMetadata(opts: MetadataOptions): Metadata {
  const url =
    !opts.path || opts.path === "/" ? SITE_URL : `${SITE_URL}${opts.path}`;
  const image = opts.image ?? DEFAULT_OG_IMAGE;

  const metadata: Metadata = {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ?? DEFAULT_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };

  if (opts.type === "article") {
    metadata.openGraph = {
      type: "article",
      locale: "en_NG",
      url,
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      publishedTime: opts.publishedTime,
      modifiedTime: opts.modifiedTime,
      authors: opts.authors,
    };
  } else {
    metadata.openGraph = {
      type: "website",
      locale: "en_NG",
      url,
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    };
  }

  return metadata;
}

/** Builds Metadata from the shared pageSEO map. */
export function pageMetadata(
  page: PageKey,
  overrides: Partial<MetadataOptions> = {},
): Metadata {
  const base = pageSEO[page];
  return buildMetadata({
    title: base.title,
    description: base.description,
    path: new URL(base.canonical).pathname,
    ...overrides,
  });
}

// JSON-LD Schema for Educational Organization
export const schoolSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Rosa Mystica High School",
  alternateName: "RMHS",
  url: "https://www.rmhsagulu.com",
  logo: "https://www.rmhsagulu.com/images/RMHS.jpg",
  description:
    "Rosa Mystica High School is a Catholic secondary school in Agulu, Anambra State, Nigeria, committed to academic excellence and character development since 1966.",
  foundingDate: "1966",
  address: {
    "@type": "PostalAddress",
    streetAddress: "426P+H48, Awka - Okigwe Rd, Nkitaku",
    addressLocality: "Agulu",
    addressRegion: "Anambra State",
    postalCode: "422109",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-8076367903",
    contactType: "Administration",
    email: "rosamysticahsa@gmail.com",
  },
  sameAs: [
    "https://facebook.com/Rmhsagulu",
    "https://www.linkedin.com/in/rosa-mystica-high-school/",
    "https://www.instagram.com/rosa_mytica/",
    "https://www.tiktok.com/@rosa_mytica",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Educational Programs",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Junior Secondary School",
          description: "Comprehensive junior secondary education program",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Senior Secondary School",
          description:
            "Advanced senior secondary education with specialization options",
        },
      },
    ],
  },
};

// Organization Schema for Local Business
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rosa Mystica High School",
  url: "https://www.rmhsagulu.com",
  logo: "https://www.rmhsagulu.com/images/RMHS.jpg",
  description:
    "Catholic secondary school in Agulu, Anambra State, Nigeria, providing quality education since 1966.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "426P+H48, Awka - Okigwe Rd, Nkitaku",
    addressLocality: "Agulu",
    addressRegion: "Anambra State",
    postalCode: "422109",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-8076367903",
    contactType: "Administration",
    email: "rosamysticahsa@gmail.com",
  },
  sameAs: [
    "https://facebook.com/Rmhsagulu",
    "https://www.linkedin.com/in/rosa-mystica-high-school/",
    "https://www.instagram.com/rosa_mytica/",
    "https://www.tiktok.com/@rosa_mytica",
  ],
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Breadcrumb Schema
export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export interface FaqItem {
  question: string;
  answer: string;
}

// FAQ Schema
export const faqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
