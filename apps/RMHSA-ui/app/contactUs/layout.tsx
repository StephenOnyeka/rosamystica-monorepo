import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
    address: {
      "@type": "PostalAddress",
      streetAddress: "426P+H48, Awka - Okigwe Rd, Nkitaku",
      addressLocality: "Agulu",
      addressRegion: "Anambra State",
      postalCode: "422109",
      addressCountry: "NG",
    },
    telephone: "+234-8076367903",
    email: "rosamysticahsa@gmail.com",
  },
};

export const metadata = pageMetadata("contact", {
  keywords:
    "Contact Rosa Mystica High School, School Contact Information, Admissions Contact, School Phone Number, School Email, Visit School, School Location Agulu",
  image: "https://www.rmhsagulu.com/RMHS/IMG_20241015_124000.jpg",
});

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SchoolJsonLd extraSchema={[contactPageSchema]} />
      {children}
    </div>
  );
}
