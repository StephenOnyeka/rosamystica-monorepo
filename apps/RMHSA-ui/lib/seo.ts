import type { Metadata } from "next";

// Default SEO configuration (migrated from lib/seo.js / components/SEO.js)
export const SITE_URL = "https://www.rmhsagulu.com";
export const SITE_NAME = "Rosa Mystica High School";
export const TWITTER_HANDLE = "@rosamysticahsa";

export const DEFAULT_TITLE =
  "Rosa Mystica High School | Best Catholic School for Girls in Nigeria";

export const DEFAULT_DESCRIPTION =
  "Rosa Mystica High School, Agulu is recognized among the best Catholic all-girls secondary schools in Nigeria. Offering academic excellence, moral discipline, and world-class boarding facilities since 1966.";

export const DEFAULT_KEYWORDS =
  "Rosa Mystica, Rosa Mystica High School, Best School for Girls, Best School for Girls in Nigeria, Best Catholic School for Girls, All-Girls Secondary School Nigeria, Catholic Girls Boarding School, RMHS Agulu, Girls High School Agulu Anambra, Secondary School for Girls in Nigeria";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/RMHS.jpg`;

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "Rosa Mystica High School | Best Catholic School for Girls in Nigeria",
    description:
      "Welcome to Rosa Mystica High School, Agulu. Recognized among the best Catholic schools for girls in Nigeria. Explore our academics, facilities, moral formation, and admissions.",
    canonical: "https://www.rmhsagulu.com",
  },
  about: {
    title: "About Us | Rosa Mystica High School - Premier Catholic School for Girls",
    description:
      "Learn about the heritage of Rosa Mystica High School (formerly Girls' High School Agulu) founded in 1966. Discover why we are rated among the best Catholic schools for girls in Nigeria.",
    canonical: "https://www.rmhsagulu.com/about",
  },
  admission: {
    title: "Admission | Enroll at Rosa Mystica High School - Best Girls School in Nigeria",
    description:
      "Apply for admission into Rosa Mystica High School Agulu. Join one of Nigeria's top Catholic boarding schools for girls. Entrance examination, fees, and requirements.",
    canonical: "https://www.rmhsagulu.com/admission",
  },
  contact: {
    title: "Contact Us | Rosa Mystica High School, Agulu, Anambra State",
    description:
      "Get in touch with Rosa Mystica High School for admissions, tours, or general inquiries. Located in Agulu, Anambra State, Nigeria. Phone: +234-8076367903.",
    canonical: "https://www.rmhsagulu.com/contactUs",
  },
  gallery: {
    title: "Campus Gallery | Rosa Mystica High School Facilities & Student Life",
    description:
      "Explore campus facilities, modern laboratories, serene boarding hostels, and vibrant student life at Rosa Mystica High School, Agulu.",
    canonical: "https://www.rmhsagulu.com/gallery",
  },
  "school-life": {
    title: "School Life | Student Experience at Rosa Mystica High School",
    description:
      "Discover life as a student at Rosa Mystica High School. Sports, arts, leadership development, moral formation, and academic activities for young women.",
    canonical: "https://www.rmhsagulu.com/school-life",
  },
  "give-to-RMHS": {
    title: "Support Rosa Mystica High School | Donate & Give Back",
    description:
      "Support Rosa Mystica High School's mission of educational excellence for girls. Your donations help us maintain state-of-the-art facilities and scholarships.",
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

// JSON-LD Schema for Educational Organization / School
export const schoolSchema = {
  "@context": "https://schema.org",
  "@type": ["School", "EducationalOrganization"],
  additionalType: "https://en.wikipedia.org/wiki/Catholic_school",
  name: "Rosa Mystica High School",
  alternateName: [
    "RMHS",
    "Rosa Mystica",
    "Girls' High School Agulu",
    "Catholic Girls High School Agulu",
  ],
  url: "https://www.rmhsagulu.com",
  logo: "https://www.rmhsagulu.com/images/RMHS.jpg",
  image: "https://www.rmhsagulu.com/images/RMHS.jpg",
  description:
    "Rosa Mystica High School is a premier Catholic all-girls secondary boarding school in Agulu, Anambra State, Nigeria, renowned for academic excellence, moral formation, and character development since 1966.",
  gender: "Female",
  foundingDate: "1966",
  educationalLevel: [
    "Junior Secondary School",
    "Senior Secondary School",
  ],
  educationalCredentialAwarded: [
    "WASSCE (WAEC)",
    "SSCE (NECO)",
    "BECE",
  ],
  keywords:
    "Rosa Mystica, Rosa Mystica High School, Best School for Girls, Best School for Girls in Nigeria, Best Catholic School for Girls",
  address: {
    "@type": "PostalAddress",
    streetAddress: "426P+H48, Awka - Okigwe Rd, Nkitaku",
    addressLocality: "Agulu",
    addressRegion: "Anambra State",
    postalCode: "422109",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.1287,
    longitude: 7.0658,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-8076367903",
    contactType: "Administration & Admissions",
    email: "rosamysticahsa@gmail.com",
    availableLanguage: ["English", "Igbo"],
  },
  sameAs: [
    "https://facebook.com/Rmhsagulu",
    "https://www.linkedin.com/in/rosa-mystica-high-school/",
    "https://www.instagram.com/rosa_mytica/",
    "https://www.tiktok.com/@rosa_mytica",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Educational Programs for Girls",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Junior Secondary School (JSS 1 - JSS 3)",
          description:
            "Foundational secondary education with strong emphasis on sciences, mathematics, arts, and moral discipline.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Senior Secondary School (SSS 1 - SSS 3)",
          description:
            "Advanced preparation for WAEC and NECO across Sciences, Arts, and Commercial departments.",
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

// Default FAQ data targeting top queries for Google Rich Snippets
export const defaultSchoolFaqs: FaqItem[] = [
  {
    question: "Is Rosa Mystica High School an all-girls school?",
    answer:
      "Yes, Rosa Mystica High School (formerly Girls' High School, Agulu) is a premier Catholic all-girls boarding secondary school located in Agulu, Anambra State, Nigeria, dedicated to female empowerment, discipline, and academic excellence.",
  },
  {
    question: "What makes Rosa Mystica High School one of the best schools for girls in Nigeria?",
    answer:
      "Rosa Mystica High School provides top-tier academic training across Sciences, Arts, and Commercial departments, modern science laboratories, outstanding WAEC/NECO results, deep-rooted Catholic moral formation, and leadership development for young women.",
  },
  {
    question: "Where is Rosa Mystica High School located in Nigeria?",
    answer:
      "Rosa Mystica High School is located in Agulu, Anaocha Local Government Area, Anambra State, Nigeria along the Awka - Okigwe Road.",
  },
  {
    question: "How do prospective students apply for admission into Rosa Mystica High School?",
    answer:
      "Parents and guardians can apply online via the official website at https://www.rmhsagulu.com/admission or visit the school administrative office in Agulu for entrance examination dates and requirements.",
  },
];
