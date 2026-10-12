import { Suspense } from "react";
import Home from "./Home";
import SchoolJsonLd from "@/components/SchoolJsonLd";
import { defaultSchoolFaqs, faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", {
  keywords:
    "Rosa Mystica, Rosa Mystica High School, Best School for Girls, Best School for Girls in Nigeria, Best Catholic School for Girls, Catholic Girls Secondary School Nigeria, Girls Boarding School Anambra, Top Girls High School Nigeria, RMHS Agulu",
  image: "https://www.rmhsagulu.com/images/RMHS.jpg",
});

// Ported from the original pages/index.js Suspense fallback (Loader)
function Loader() {
  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center animate-pulse">
        <div className="bg-[url('/images/RMHS.jpg')] w-20 h-20 rounded-full bg-cover bg-center max-md:w-16 max-md:h-16 max-sm:w-12 max-sm:h-12"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <SchoolJsonLd extraSchema={[faqSchema(defaultSchoolFaqs)]} />
      <Suspense fallback={<Loader />}>
        <Home />
      </Suspense>
    </div>
  );
}
