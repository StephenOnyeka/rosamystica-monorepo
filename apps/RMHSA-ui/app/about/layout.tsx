import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
    foundingDate: "1966",
    description:
      "Catholic secondary school in Agulu, Anambra State, Nigeria, committed to academic excellence and character development.",
  },
};

export const metadata = pageMetadata("about", {
  keywords:
    "About Rosa Mystica High School, School History Agulu, Catholic School Nigeria, Educational Mission, School Values, Academic Excellence, School Facilities, Faculty Information",
  image: "https://www.rmhsagulu.com/Edited/PSX20.jpg",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SchoolJsonLd extraSchema={[aboutPageSchema]} />
      {children}
    </div>
  );
}
