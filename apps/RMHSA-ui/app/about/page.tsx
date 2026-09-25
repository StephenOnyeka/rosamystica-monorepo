"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";

export default function About() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className="font-poppins">
        <div className="bg-[url('/Edited/PSX20.jpg')] bg-cover bg-no-repeat bg-center ">
          <div
            id="About_container-1"
            className="bg-linear-to-b from-black/30 to-black/80 px-8 pt-8 max-sm:px-4 w-full font-poppins text-white"
          >
            <div className="">
              <Navbar />
            </div>

            <div className="pt-[50%] pb-[5%] lg:pt-[30%] z-1 text-white ">
              <p className="text-xl max-sm:text-lg">Know Us Better</p>
              <p className="text-5xl font-bold max-sm:text-3xl">About Us</p>
            </div>
          </div>
        </div>
        <div id="About_container-2" className="px-8 py-6 max-sm:px-4">
          <span className="flex gap-3 text-gray-500 items-center">
            <Link href="/" className="font-medium">
              Home
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
            <Link href="/about" className="text-primary">
              About Us
            </Link>
          </span>
          <div id="RosaMystica" className="flex flex-col items-center py-10">
            <div className="flex gap-16 max-xl:flex-wrap max-sm:gap-8 ">
              <div className="min-w-80">
                <p className=" font-bold font-poppins text-3xl text-contingent max-sm:text-2xl">
                  Rosa Mystica's History
                  <span className="element-divider-seperator flex w-5/6 mt-4 border-2 border-primary max-sm:w-4/6 "></span>
                </p>
              </div>
              <div className="grid grid-cols-2 max-xl:grid-cols-1 max-xl:grid-rows-2 max-xl:grid-flow-row ">
                <p className=" text-gray-500 leading-7 min-w-60 px-6 max-sm:px-0 max-sm:leading-6 max-sm:text-sm text-justify">
                  <span className="font-bold mb-8">THE PRELIMNARIES</span>
                  <br />
                  The birth of Girls’ High School, Agulu (now renamed ‘Rosa
                  Mystica High School, Agulu’) was forerun in the missionary
                  enterprise of the early missionaries whose interest was
                  fundamentally the establishment of church as well as schools.
                  In other words, the missions of the early missionaries were
                  inseparably about God and learning; hence, Mission Schools.
                  Thus, schools were veritable means of learning more about God,
                  self, the world and fellow human beings.
                </p>
                <p className=" text-gray-500 leading-7 min-w-60 px-6 max-sm:px-0 max-sm:leading-6 max-sm:text-sm text-justify">
                  In his second Missionary journey to Agulu in 1914, Rev. Fr.
                  Albert Bubendorff opened an evening school that was to be an
                  opportunity for more learning and exercise of faith. The
                  choice of Nwagu-Agulu as a central place in the town for the
                  school was welcomed as Chiefs Agupugo Ejelue and Anyoke
                  Ogbudaa donated a land at Onike/Ogbuduli Agulu. The evening
                  school serving also as the Church was very functional till
                  1924 when some members from Agulu-Enu asked that an equivalent
                  should be established nearer to them lest they began attending
                  Masses elsewhere.
                </p>
              </div>
            </div>

            <br />

            <button
              onClick={() => {
                setShow((show) => !show);
              }}
              className=" flex items-center justify-center bg-transparent border-none cursor-pointer"
            >
              {show ? (
                <MdKeyboardDoubleArrowUp
                  size={35}
                  fill="#0099FF"
                  className="animate-pulse"
                />
              ) : (
                <MdKeyboardDoubleArrowDown
                  size={35}
                  fill="#0099FF"
                  className="animate-bounce "
                />
              )}
            </button>
            <div
              className={`overflow-hidden transition-max-height ${
                show ? "max-h-[10000px]" : "max-h-0"
              }`}
            >
              {show && (
                <div className=" grid grid-cols-1 leading-7 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 max-sm:text-sm text-justify text-gray-500 max-sm:leading-6">
                  In 1927, the Agulu people from Umuowele, Umunnowu, Umuifite,
                  Ifiteana and Nneogidi villages first decamped from the Mission
                  school at Nwagu and had their own Church, ‘St. Matthias
                  Mission School’ at Ikpo. In 1934, considering a more central
                  position, the Church and Mission at Ikpo were relocated to the
                  site of the present ‘St. John’s Catholic Mission, Agulu’.
                  Consequently, the same year, ‘Eze-Anyanwu Primary Mission
                  School’ was opened through the generous donation of land by
                  Chief Muojama Ezeobikili of Nneoha village, Agulu. This school
                  was regarded as “Agulu B Station” which later metamorphosed
                  into ‘St. Patrick’s Catholic Mission, Agulu’.
                  <br />
                  <br />
                  Consequent upon the internal crisis at ‘Eze-Anyanwu Primary
                  Mission School’, a new mission school that gave birth to the
                  present ‘St. Theresa’s Catholic Mission’ was opened at
                  Isiamaigbo village Agulu through the generous donation of land
                  by Mr. Ofo Mgbachi. With the transfer of Rev. Fr. Liddane to
                  Adazi in 1930, a decree was made that closed all the stations
                  (except for evening classes) nearer to Adazi where Holy Masses
                  were being celebrated every Sunday. In 1936, ‘Agulu Catholic
                  Pioneer Teachers’ comprising of few members came and made
                  peace among all the stations in Agulu. Their efforts yielded
                  fruits as a central catechumen class involving all the
                  stations was established and the town became united once more
                  having a central committee and central finance. In 1938,
                  through the influence and sponsorship of the union, a big
                  football field was carved out on the same land at Nwagu that
                  accommodated the Central Catechumen class attached to ‘St.
                  Mary’s Agulu’ and a football match was held on 27th December,
                  1938.
                  <p>
                    In 1947, another school named ‘St. John Bosco’s Preliminary
                    Training Centre’ was opened at the same Nwagu-Agulu for one
                    year course for teachers. The school was later re-named ‘St.
                    Anthony’s College’ serving as Elementary Training College
                    (ETC). With Fr. Chamberline as her first Principal, it
                    started running four years program. The ‘St. Mary’s Infant
                    School’ became the Practicing School for the college and has
                    remained till today. St. Anthony’s Elementary Training
                    College became very famous through the notable leadership of
                    her various Principals: Fr. Chamberline (1948-1950); Fr.
                    Halpping (1951-1956); Fr. Edward Hurley (1957-1962) and Fr.
                    Cockran (1963-1965) who was heading the school until 1965
                    when the government of Eastern Nigerian Region closed down
                    schools of such kind. The ‘St. Anthony’s Elementary Teacher
                    Training College’ phased out but the Practicing School
                    remained in the land of St. Mary’s, Agulu. The closure of
                    the college was a very painful one to all but little did
                    anyone know that God had a plan: the foundation of ‘Girls’
                    High School, Agulu’.
                    <br />
                    <br />
                    <span className="font-bold mb-8">
                      THE BIRTH OF GIRLS’ HIGH SCHOOL AGULU
                    </span>
                    <br />
                    The ‘Girls’ High School, Agulu’, formerly called ‘Catholic
                    Girls’ Secondary School, Agulu’ was founded in January, 1966
                    by late Archbishop Charles Heery (C.S.Sp.), the Archbishop
                    of Onitsha. According to the preliminary accounts above, the
                    site, formerly a big forest uninhabited by people first
                    became the former Practising Teachers’ College converted in
                    1964 to lower Elementary Training College popularly known as
                    ‘St. John Bosco’s College, Agulu and later to higher
                    Elementary college named ‘St. Anthony’s Teachers College,
                    Agulu’. With the clearing and lease of land by Rev. Fr.
                    Liddane, the then Parish Priest of Adazi-Nnukwu, the College
                    was solely owned and managed by the Catholic Mission.
                    Initially, the Holy Ghost Fathers from Kimage Manor in
                    Ireland: Rev. Fathers Halpping, Chamberline, Regan and
                    finally Rev. Fr. Edward Hurley were in-charge of the school
                    while Mr. Nwabugwu and Mr. E. C. Ezeobi were of much help in
                    the administration of the school.
                  </p>
                  <p>
                    Significant to mention was the enormous effort of Rev. Fr.
                    Edward Hurley. With his administration, the then ‘St.
                    Anthony’s College’ was famous for discipline, high academic
                    standards and excellence in sports. He constructed the
                    buildings, the sports arena and the present school
                    auditorium. His enviable personality and effective presence
                    made much impact on the former St. Anthony’s students and
                    teachers who, in a way, were respectively the prefigures of
                    the students and teachers of Girls’ High School, Agulu.
                    Pleased with God, Fr. Edward Hurley died in active service
                    in the school in August, 1962 while about completing the
                    auditorium which later was named after him (Hurley
                    Auditorium) in the school. We pray for the peaceful rest of
                    his soul in the bosom of the Lord. ...
                  </p>
                  <div>
                    <p className="italic font-bold">
                      To know more, extensively about the School's history,
                      download here
                    </p>
                    <a
                      href="/PDF/HISTORY OF ROSA MYSTICA HIGH SCHOOL.pdf"
                      download="HISTORY OF ROSA MYSTICA HIGH SCHOOL AGULU"
                    >
                      <button className="bg-primary flex items-center gap-4 text-white font-bold px-4 py-3 mt-4 max-sm:text-sm">
                        Full History File
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          className="text-white font-black"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="none"
                            strokeWidth="2"
                            d="M4.99787498,8.99999999 L4.99787498,0.999999992 L19.4999998,0.999999992 L22.9999998,4.50000005 L23,23 L4,23 M18,1 L18,6 L23,6 M3,12 L3.24999995,12 L4.49999995,12 C6.5,12 6.75,13.25 6.75,14 C6.75,14.75 6.5,16 4.49999995,16 L3.24999995,16 L3.24999995,18 L3,17.9999999 L3,12 Z M9.5,18 L9.5,12 C9.5,12 10.4473684,12 11.2052633,12 C12.3421053,12 13.5,12.5 13.5,15 C13.5,17.5 12.3421053,18 11.2052633,18 C10.4473684,18 9.5,18 9.5,18 Z M16.5,19 L16.5,12 L20.5,12 M16.5,15.5 L19.5,15.5"
                          ></path>
                        </svg>
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div
            id="About_container-2"
            className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center h-full "
          >
            <div className=" flex items-center px-10 gap-8 bg-primary/70 h-full text-white leading-7 py-8 md:py-16 max-md:flex-wrap max-sm:leading-6 max-sm:text-sm justify-between">
              <div className="w-full">
                <p className="font-bold text-xl max-sm:text-lg">
                  Our Philosophy
                </p>
                <br />
                <p>
                  Our school is committed to nurturing young minds through a
                  holistic education that fosters academic excellence, character
                  development, and a lifelong love of learning.
                </p>
              </div>
              <div className="w-full">
                <p className="font-bold text-xl max-sm:text-lg">
                  Rosa Mystica's Principle
                </p>
                <br />
                <p>
                  The Rosa Mystica Principle emphasizes the importance of
                  balance between intellectual, emotional, and spiritual growth.
                  We strive to cultivate well-rounded individuals who are
                  compassionate, responsible, and dedicated to making a positive
                  impact on the world.
                </p>
              </div>
              <div className="w-full">
                <p className="font-bold text-xl max-sm:text-lg">
                  Key of Success
                </p>
                <br />
                <p>
                  Our keys to success include rigorous academics, dedicated
                  teachers, supportive staff, and a strong emphasis on character
                  education. We believe that by fostering a positive school
                  culture and providing a comprehensive education, we can help
                  our students achieve their goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commented out previous version for reference */}
        {/* <div id="About_container-3" className="relative w-full min-h-screen max-md:min-h-fit"> */}

        <div
          id="About_container-3"
          className="relative w-full max-md:min-h-fit"
        >
          {/* Using Grid for proper layout with visual stacking */}
          {/* <div className="grid gap-8 max-md:gap-6"> */}
          <div className="grid gap-0 max-md:gap-0">
            {/* Special School Tour Section */}
            <div className="grid md:grid-cols-2 items-center gap-y-8">
              <div className="flex flex-col gap-6 px-10 mr-10">
                <div className="relative">
                  <Image
                    src="/svgs/about-icon-1.png"
                    alt=""
                    width={64}
                    height={50}
                    className="relative w-16"
                  />
                </div>
                <p className="text-3xl font-semibold max-md:text-xl">
                  Special School Tour
                </p>
                <p className="text-gray-500 leading-7 max-md:leading-6 max-md:text-sm">
                  Experience our state-of-the-art facilities, meet our inspiring
                  faculty, and learn about our exciting extracurricular
                  activities. Our campus tours offer a firsthand look at what
                  makes our school a special place to learn and grow.
                </p>
              </div>
              <div className="bg-cover bg-[url('/images/R-main.jpg')] w-full h-[500px] md:max-h-full"></div>
            </div>

            {/* Graduation Section */}
            <div className="grid md:grid-cols-2 items-center gap-y-8">
              <div className="bg-cover bg-[url('/grad1.png')] w-full h-[500px] md:max-h-full"></div>
              <div className="flex flex-col gap-6 px-10 ml-10">
                <div className="relative">
                  <Image
                    src="/svgs/about-icon-2.png"
                    alt=""
                    width={64}
                    height={50}
                    className="relative w-16"
                  />
                </div>
                <p className="text-3xl font-semibold max-md:text-xl">
                  Graduation
                </p>
                <p className="text-gray-500 text leading-7 max-md:leading-6 max-md:text-sm">
                  Graduation marks the culmination of years of hard work and
                  dedication. We celebrate our graduates' achievements and wish
                  them all the best as they embark on the next chapter of their
                  lives.
                </p>
              </div>
            </div>

            {/* Powerful Alumnae Section */}
            <div className="grid md:grid-cols-2 items-center gap-y-8">
              <div className="flex flex-col gap-6 px-10 mr-10">
                <div className="relative">
                  <Image
                    src="/svgs/about-icon-3.png"
                    alt=""
                    width={64}
                    height={50}
                    className="relative w-16"
                  />
                </div>
                <p className="text-3xl font-semibold max-md:text-xl">
                  Powerful Alumnae
                </p>
                <p className="text-gray-500 text leading-7 max-md:leading-6 max-md:text-sm">
                  Our alumnae network is a testament to the power of a strong
                  education. Our graduates are leaders in their fields, making a
                  difference in communities around the globe. <b>For Alumna</b>-
                  Join our vibrant alumnae community and connect with
                  like-minded individuals who share your passion for learning
                  and service.
                </p>
              </div>
              <div className="bg-contain bg-no-repeat bg-left bg-[url('/FunPic_20250326_173347003.jpg')] w-full h-[500px] md:max-h-full"></div>
            </div>

            {/* Banners Section */}
            <div className="bg-contingent py-16 w-full">
              <div className="grid grid-flow-col gap-28 justify-center content-center items-center max-md:flex max-md:flex-wrap max-md:justify-evenly max-md:gap-12 max-md:items-center">
                <Image
                  src="/1-Banner.png"
                  alt=""
                  width={80}
                  height={60}
                  className="w-20 max-sm:w-16"
                />
                <Image
                  src="/2-Banner.png"
                  alt=""
                  width={80}
                  height={60}
                  className="w-20 max-sm:w-16"
                />
                <Image
                  src="/3-Banner.png"
                  alt=""
                  width={80}
                  height={60}
                  className="max-sm:w-10"
                />
                <Image
                  src="/4-Banner.png"
                  alt=""
                  width={176}
                  height={156}
                  className="w-44 max-sm:w-32"
                />
                <Image
                  src="/5-Banner1.png"
                  alt=""
                  width={80}
                  height={60}
                  className="w-20 max-sm:w-20 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
