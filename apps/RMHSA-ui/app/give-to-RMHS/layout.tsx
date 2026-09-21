import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const donatePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Support Rosa Mystica High School",
  description:
    "Support Rosa Mystica High School's mission of educational excellence through donations",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
  },
};

export const metadata = pageMetadata("give-to-RMHS", {
  keywords:
    "Donate to Rosa Mystica High School, School Donation, Support Education, School Funding, Educational Donation, School Support, Give Back to School",
  image: "https://www.rmhsagulu.com/images/donation-banner.jpg",
});

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SchoolJsonLd extraSchema={[donatePageSchema]} />
      {children}
    </div>
  );
}
