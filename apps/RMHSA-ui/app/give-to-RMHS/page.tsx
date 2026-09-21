"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import ScrollDiv from "@/components/Scroll";
import Accordion from "@/components/Accordion";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import Footer from "@/components/Footer";

export default function Donate() {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const handleAccordionToggle = (id: number) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };
  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className=" h-full font-poppins overflow-hidden">
        <div className="bg-[url('/Edited/1732230029150.jpg')] bg-cover bg-center">
          <div
            id="Donor_container-1"
            className="bg-black/70 px-8 pt-8 max-sm:px-4 w-full font-poppins text-white"
          >
            <div className="">
              <Navbar />
            </div>

            <div className=" pt-[50%] pb-[5%] lg:pt-[30%] z-1 text-white">
              <p className="text-xl pb-3 max-sm:text-lg max-sm:pb-1">
                Become a donor
              </p>
              <p className="text-5xl font-bold max-sm:text-3xl">
                Give To Rosa Mystica
              </p>
            </div>
          </div>
        </div>

        <div id="Donor_container-2" className="px-8 py-6 w-full max-sm:px-4">
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
              Give To Rosa Mystica
            </Link>
          </span>
          <div className="py-10">
            <div className="flex gap-12 w-full max-md:flex-wrap">
              <div className="w-5/6 max-sm:w-full">
                <div>
                  <p className=" font-semibold font-poppins text-3xl text-black max-md:text-2xl max-sm:text-xl">
                    About Rosa Mystica Fund
                  </p>
                  <br />
                  <p className=" text-gray-500 leading-7 max-sm:text-sm max-sm:leading-6">
                    We continue to adapt to new ways of teaching, new
                    disciplines of study and new ways of learning. Your gift
                    enriches the experience of all students by supporting
                    efforts to recruit top faculty, expand academic programs
                    and respond to the emerging needs of our school and our
                    world.
                  </p>
                  <br />
                  <p className=" text-gray-500 leading-7 max-sm:text-sm max-sm:leading-6">
                    Not only does Rosa Mystica High School provide you the
                    practical skills that is necessary to transition
                    seamlessly into the workforce upon your graduation, but we
                    also make sure that you will have a good sense of social
                    justice so that you make the transition responsibly.
                  </p>
                  <br />
                  {/* original uses layout="responsive" -> equivalent: style width/height + sizes="100vw" */}
                  <Image
                    src="/Edited/WhatsApp Image 2024-12-07 at 16.00.26_6fee0c7a.jpg"
                    className="pt-8 w-full h-full"
                    width={500}
                    height={250}
                    style={{ width: "100%", height: "auto" }}
                    sizes="100vw"
                    alt=""
                  />
                </div>

                <div id="" className="py-16 ">
                  <div className="flex justify-between w-full items-center py-8 ">
                    <p className="text-2xl font-semibold max-sm:text-xl">
                      Various Donation Options{" "}
                    </p>
                    <hr className="border-2 border-gray-200 w-3/5" />
                  </div>
                  <div className="h-[50vh] text-center max-sm:h-fit">
                    <div className=" grid grid-cols-3 gap-6 max-md:gap-3">
                      <div
                        onClick={() => handleAccordionToggle(1)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            {" "}
                            Student Scholarships
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleAccordionToggle(2)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            {" "}
                            Academic Ecosystem
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleAccordionToggle(3)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            {" "}
                            Library & Cultural
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleAccordionToggle(4)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            {" "}
                            Campus Infrastructure
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleAccordionToggle(3)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            {" "}
                            Student Life
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => handleAccordionToggle(5)}
                        className=" bg-[url('/an-open-book.jpg')] bg-cover bg-center cursor-pointer "
                      >
                        <div className=" flex items-center justify-center bg-primary/70 h-full py-14 max-sm:py-6 max-sm:px-2 text-white">
                          <p className="text-base font-semibold max-md:text-sm">
                            Emergency Fund
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="flex justify-between w-full items-center pb-8">
                    <p className="text-2xl font-semibold max-sm:text-xl">
                      Why give to Rosa Mystica?
                    </p>
                    <hr className="border-2 border-gray-200 w-3/5" />
                  </div>

                  <div className="py-4">
                    <Accordion
                      openAccordionId={openAccordionId}
                      toggleAccordion={handleAccordionToggle}
                    />
                  </div>
                </div>
                <div className="py-8">
                  <div className="flex justify-between w-full items-center pb-4">
                    <p className="text-2xl font-semibold max-sm:text-xl text-contingent">
                      Bank Details
                    </p>
                    <hr className="border-2 border-primary/30 w-3/5" />
                  </div>

                  <div className="py-4 leading-8">
                    <span className="font-semibold">Account Name:</span> Rosa
                    Mystica High School Agulu
                    <br />
                    <span className="font-semibold">Bank:</span> Zenith Plc
                    <br />
                    <span className="font-semibold">Account Number:</span>{" "}
                    1013330418
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 text-white w-2/5 max-md:w-full">
                <button className="bg-primary p-6 font-bold">
                  Become A Donor
                </button>
                <div className="bg-contingent py-12 pl-10 leading-8 max-lg:px-4 max-sm:px-8">
                  <div className="pb-6">
                    <p className="text-xl font-bold pb-2">
                      Department Contact Info
                    </p>
                    <p className="font-semibold ">Office of Science</p>
                  </div>
                  <div className="pb-6">
                    <p>Inside School Roadway - NW (North-West)</p>
                  </div>
                  <div className="pb-6">
                    <p>
                      Mr. Elias Okoli -{" "}
                      <span className="font-semibold">H.O.D.</span>{" "}
                    </p>
                    <p>+2348037383460 </p>
                  </div>
                  <p className="pb-6">Mon-Fri 9:00A.M.-5:00P.M.</p>
                </div>

                <div className="bg-contingent-2 py-12 pl-10 leading-8 max-lg:px-4 max-sm:px-8 max-sm:mb-8 max-sm:py-6">
                  <div className="pb-6">
                    <p className="text-xl font-bold pb-4">
                      Department Contact Info
                    </p>
                    <p className="font-semibold text-secondary">
                      Office of Arts
                    </p>
                  </div>
                  <div className="pb-6">
                    <p>Inside School Roadway - NW (North-West)</p>
                  </div>
                  <div className="pb-6">
                    <p>+2348068267331 </p>
                    <p>
                      Mrs. Margaret Maduagwu -{" "}
                      <span className="font-semibold">H.O.D.</span>
                    </p>
                  </div>
                  <p className="pb-6 text-secondary">
                    Mon-Fri 9:00A.M.-5:00P.M.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white h-full max-sm:absolute z-1 ">
          <div className="bg-contingent flex gap-10 items-center justify-center px-6 pt-24 w-full py-28 max-sm:flex-wrap max-sm:py-16">
            <div className="w-2/4 px-8 max-sm:w-full max-sm:px-4">
              {/* original uses layout="responsive" -> equivalent: style width/height + sizes="100vw" */}
              <Image
                src="/Edited/1732230029137.jpg"
                alt=""
                width={500}
                height={200}
                className="w-full -mt-40 max-sm:-mt-32"
                style={{ width: "100%", height: "auto" }}
                sizes="100vw"
              />
            </div>
            <div className="w-2/4 flex flex-col gap-12 max-sm:w-full max-sm:gap-6">
              <p className="text-2xl leading-10 max-sm:text-xl max-sm:leading-8">
                Thanks to you, our students are gaining the knowledge, skills
                and values to create a more humane, just, and sustainable
                world.
              </p>
              <p className="text-lg font-semibold max-sm:text-sm">
                Lady Chinwe Maduka
                <br />
                <span className="font-normal">School Principal</span>
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
