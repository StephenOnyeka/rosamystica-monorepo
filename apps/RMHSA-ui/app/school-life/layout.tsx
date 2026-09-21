import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const schoolLifeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "School Life - Rosa Mystica High School",
  description:
    "Discover student life and campus experience at Rosa Mystica High School",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
  },
};

export const metadata = pageMetadata("school-life", {
  // The legacy page overrode the description via next/head; keep that override.
  description:
    "Discover the vibrant school life at Rosa Mystica High School. Explore our events, traditions, and how to participate in our dynamic community.",
  keywords:
    "School Life Rosa Mystica, Student Experience, Academic Programs, Extracurricular Activities, Sports, Campus Community, Student Activities, School Events",
  image: "https://www.rmhsagulu.com/images/school-life-banner.jpg",
});

export default function SchoolLifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SchoolJsonLd extraSchema={[schoolLifeSchema]} />
      {children}
    </div>
  );
}
