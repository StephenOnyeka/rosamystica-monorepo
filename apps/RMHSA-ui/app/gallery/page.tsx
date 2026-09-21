import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Rosa Mystica High School Gallery",
  description:
    "Photos showcasing campus facilities and student life at Rosa Mystica High School",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
  },
};

export const metadata = pageMetadata("gallery", {
  keywords:
    "Rosa Mystica High School Gallery, School Photos, Campus Facilities, Student Life Photos, School Building, Chapel, Library, Sports Facilities, School Events",
  image: "https://www.rmhsagulu.com/images/R-main(entrance).jpg",
});

export default function Gallery() {
  return (
    <div className="p-4">
      <SchoolJsonLd extraSchema={[gallerySchema]} />
      <p className="py-4 mb-2 font-bold text-lg text-center">Gallery</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-2 ">
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-main(entrance).jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Main Building (Entrance-View)
            </p>
          </div>
        </div>

        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029126.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Main building
            </p>
          </div>
        </div>

        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029099.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Chapel
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029081.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Chapel (inner-view)
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029066.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Hail Mary Grotto
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-hailmary.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Hail Mary Grotto (closer-view)
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029053.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Administrative Block
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1732230029023.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Administrative Block (side-view)
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-library.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Library
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-science2.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Science Lab
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-class.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Classroom
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1733039444212.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Conference Hall
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Edited/1733039444189.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Infirmary
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/images/R-ICT.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              ICT Lab
            </p>
          </div>
        </div>
      </div>

      <div className="added font-bold text-blue-600 text-lg italic my-6 max-sm:my-4">
        <p>
          We are pivoted on giving your child the best of growth experience,
          academically, morally,...
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-2 ">
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/1726065374828.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Representing at national competitions
            </p>
          </div>
        </div>

        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/1726065382316.jpg')] bg-cover bg-no-repeat bg-center "></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Educational competition at National level.
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/IMG-20241026-WA0007~4.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Conference with Students
            </p>
          </div>
        </div>

        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/IMG-20241026-WA0008.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Ongoing conference with students - 2nd image
            </p>
          </div>
        </div>
      </div>

      <div className="added font-bold text-blue-600 text-lg italic my-6 max-sm:my-4">
        <p>...And spiritual wise.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-2 ">
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/1726065589415.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Meeting with his Lordship, Bishop of Ekwulobia Diocese
            </p>
          </div>
        </div>

        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/1726065592701.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              A brief chat with the Bishop on Christianity and Spiritual growth
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/IMG-20241026-WA0006.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Celebration of Mass with Students
            </p>
          </div>
        </div>
        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
          <div className="h-64 w-full bg-[url('/Events/IMG-20241026-WA0005.jpg')] bg-cover bg-no-repeat bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[80%] transition-all pt-4">
            <p className="text-white italic font-semibold max-sm:text-sm">
              Ongoing Holy Mass
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
