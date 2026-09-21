import { Suspense } from "react";
import Home from "./Home";
import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", {
  keywords:
    "Rosa Mystica High School, Agulu, academics, athletics, facilities, education, RMHS, Rosa, Rosa Mystica, Girls, Best School for girls, Best School in Nigeria, Best School in Anambra, Best School in Agulu, Best School for Girls in Nigeria, Girls School, Rosa Mystica Nigeria, Agulu Girls, Best for girls, Rosa Mystica High School Agulu, Rosa Mystica High School Nigeria, Girls High School, Top 3 best school for girls in Nigeria, Top 3 best school in Anambra, Top 3 best school in Agulu, Top 3 best school for girls",
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
      <SchoolJsonLd />
      <Suspense fallback={<Loader />}>
        <Home />
      </Suspense>
    </div>
  );
}
