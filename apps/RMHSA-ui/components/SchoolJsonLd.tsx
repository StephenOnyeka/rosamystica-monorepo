import { organizationSchema, schoolSchema } from "@/lib/seo";

interface SchoolJsonLdProps {
  extraSchema?: Record<string, unknown>[];
}

/**
 * Renders the EducationalOrganization + Organization JSON-LD structured
 * data that was previously injected by the legacy <SEO /> component.
 */
export default function SchoolJsonLd({ extraSchema = [] }: SchoolJsonLdProps) {
  const schemaData = [schoolSchema, organizationSchema, ...extraSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
}
