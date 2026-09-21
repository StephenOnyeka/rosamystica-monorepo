"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import Footer from "@/components/Footer";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function SchoolLife() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Topfile />
      <ScrollDiv />
      <div className=" font-poppins overflow-hidden">
        <div className="bg-[url('/Edited/PSX30.jpg')] bg-cover bg-no-repeat bg-center max-sm:bg-cover">
          <div
            id="SchoolLife_container-1"
            className="bg-linear-to-b from-black/40 to-black/80 px-8 pt-8 max-sm:px-4 w-full font-poppins text-white"
          >
            <div className=" ">
              <Navbar />
            </div>

            <div className="pt-[28%] pb-[5%] lg:pt-[30%] text-white">
              <div className="flex gap-16 max-md:flex-wrap max-md:content-center max-md:gap-0">
                <div className="min-w-80">
                  <div className="font-bold font-poppins text-4xl max-md:text-2xl">
                    Elevate Your Potential at Rosa Mystica
                    <div className="flex content-center items-center justify-between pt-4">
                      <span className="element-divider-seperator flex w-5/6 border-2 border-primary"></span>
                      <span
                        onClick={() => {
                          setShow((show) => !show);
                        }}
                      >
                        {show ? (
                          <MdKeyboardDoubleArrowUp
                            size={20}
                            fill="#0099FF"
                            className="animate-pulse md:hidden"
                          />
                        ) : (
                          <MdKeyboardDoubleArrowDown
                            size={20}
                            fill="#0099FF"
                            className="animate-bounce md:hidden"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg leading-8 px-6 max-md:px-3 max-md:leading-6 max-md:text-sm max-sm:px-0 max-md:hidden">
                  Immerse yourself in a stimulating academic environment
                  designed to nurture your intellectual curiosity. Experience
                  rigorous coursework, engaging extracurricular activities, and
                  a vibrant campus community. Join a legacy of excellence and
                  prepare for a bright future.
                </p>
                <div className="text-lg leading-8 px-6 max-md:px-3 max-md:leading-6 max-md:text-sm max-sm:px-0 md:hidden">
                  <div
                    className={`overflow-hidden transition-max-height ${
                      show ? "max-h-[10000px]" : "max-h-0"
                    }`}
                  >
                    {show && (
                      <span>
                        Immerse yourself in a stimulating academic environment
                        designed to intellectual curiosity. Experience rigorous
                        coursework, engaging extracurricular activities, and a
                        vibrant campus community. Join a legacy of excellence
                        and prepare for a bright future.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="SchoolLife_container-2"
          className="flex justify-between gap-10 max-md:flex-wrap"
        >
          <div className="w-full pt-24 pb-20 px-10 max-sm:px-8">
            <p className="font-semibold font-poppins text-2xl text-black pb-6 max-sm:text-xl">
              Event and traditions
            </p>
            <p className=" text-contingent text-xl leading-8 ">
              {" "}
              For generations, Rosa Mystica has been shaping the minds of future
              leaders. Our rich history of academic achievement, coupled with a
              strong emphasis on character development, sets us apart.
            </p>
            <br />
            <p className=" text-gray-500 leading-7 pr-30 max-sm:leading-6 max-sm:text-sm">
              Experience a wide range of academic and extracurricular
              opportunities, from prestigious competitions to cultural
              celebrations.
            </p>
            <div className="">
              <span className="element-divider-seperator flex my-12 border-2 border-contingent"></span>

              <p className=" font-bold font-poppins text-2xl text-contingent py-6 max-sm:text-xl">
                How to Participate?
              </p>
              <ol className=" text-gray-500 leading-7 max-sm:text-sm max-sm:leading-6 list-decimal">
                <li>
                  <b>Schedule a Campus Tour:</b> Explore our state-of-the-art
                  facilities and meet our dedicated faculty.
                </li>
                <li>
                  <b>Attend an Information Session:</b> Learn about our rigorous
                  academic curriculum, athletic teams, and exciting
                  extracurricular activities.
                </li>
                <li>
                  <b>Apply Online:</b> Submit your application and supporting
                  documents.
                </li>
              </ol>
              <button
                onClick={() => {
                  setShow((show) => !show);
                }}
                className="my-2"
              >
                {show ? (
                  <p className="animate-pulse text-primary cursor-pointer">
                    See Less...
                  </p>
                ) : (
                  <p className="animate-pulse text-primary cursor-pointer">
                    See more...
                  </p>
                )}
              </button>
              <div
                className={`overflow-hidden transition-max-height ${
                  show ? "max-h-[15000px]" : "max-h-0"
                }`}
              >
                {show && (
                  <div className="flex flex-wrap leading-7 max-sm:leading-6 max-sm:text-sm">
                    <p className="text-gray-500 ">
                      Imagine a place where learning is fun, friendships are
                      strong, and opportunities are endless. A place where you
                      can excel in academics, dominate the sports field, or
                      unleash your creativity.
                      {/* original uses layout="responsive" -> equivalent: style width/height + sizes="100vw" */}
                      <Image
                        src="/RMHS/IMG_20241015_140910.jpg"
                        alt=""
                        width={300}
                        height={150}
                        className=""
                        style={{ width: "100%", height: "auto" }}
                        sizes="100vw"
                      />
                      At Rosa Mystica, we believe in nurturing well-rounded
                      individuals. Our dedicated teachers inspire you to reach
                      your full potential, while our state-of-the-art facilities
                      provide the perfect environment for learning and growth.
                      {/* original uses layout="responsive" -> equivalent: style width/height + sizes="100vw" */}
                      <Image
                        width={300}
                        height={150}
                        src="/RMHS/IMG_20241015_141332.jpg"
                        alt=""
                        style={{ width: "100%", height: "auto" }}
                        sizes="100vw"
                      />
                      From exciting clubs and societies to thrilling sports
                      competitions, there’s always something to get involved in.
                      Join us and experience a school life that’s both
                      challenging and rewarding
                    </p>
                  </div>
                )}
              </div>
              <br />
              <a href="/PDF/DAILY TIME TABLE.pdf" target="_blank" className="">
                <button className="bg-primary flex items-center gap-4 text-white font-bold p-4 mt-4 max-sm:text-sm">
                  Daily Guide Routine
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

          <div className=" bg-gray-200 pt-24 pb-20 px-10 pl-20 w-full text-gray-500 max-sm:px-8">
            {/* original uses layout="responsive" -> equivalent: style width/height + sizes="100vw" */}
            <Image
              src="/RMHS/signboard.png"
              width={200}
              height={500}
              alt=""
              className="w-full h-full"
              style={{ width: "100%", height: "auto" }}
              sizes="100vw"
            />
            <div className="flex  flex-col">
              <div className="flex gap-6 items-center my-6 max-sm:gap-3">
                <Image
                  src="/icon-transportation.png"
                  width={30}
                  height={30}
                  alt=""
                />
                <p className="text-lg text-black font-semibold mt-4">
                  Transportations
                </p>
              </div>
              <p className="font-bold mb-2 max-sm:text-sm max-sm:leading-6">
                There are many options to travel in the school.
              </p>
              <p className="max-sm:text-sm max-sm:leading-6">
                Land transportation is the most commute way of getting to us.
                Don't forget to observe traffic lights.
              </p>
            </div>
            <div className="flex  flex-col">
              <div className="flex gap-6 items-center my-8">
                <Image width={30} height={30} src="/icon-parking.png" alt="" />
                <p className="text-lg text-black font-semibold mt-4">Parking</p>
              </div>
              <p className="max-sm:text-sm max-sm:leading-6">
                More than 1000 parking lots available on the west and north side
                of the school. The parking is available 24 hours with
                security. We make sure that everything is under control.
              </p>
            </div>
          </div>
        </div>
        <div className="flex content-center justify-center items-center h-32">
          <div className="">
            <Drawer>
              <DrawerTrigger asChild>
                <button className="flex gap-4 text-primary text-lg font-semibold">
                  Open Gallery{" "}
                  <span>
                    <MdKeyboardDoubleArrowDown
                      size={35}
                      fill="#0099FF"
                      className="animate-bounce "
                    />
                  </span>
                </button>
              </DrawerTrigger>
              <DrawerContent className="">
                <div className="mx-auto w-full 2xl:max-w-7xl px-4">
                  <DrawerHeader>
                    <DrawerTitle>School Structure</DrawerTitle>
                    <DrawerDescription>Gallery Photos</DrawerDescription>
                  </DrawerHeader>
                  <div className=" ">
                    <div className="overflow-hidden overflow-y-scroll p-4 h-[70vh] ">
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
                          We are pivoted on giving your child the best of growth
                          experience, academically, morally,...
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
                              Meeting with his Lordship, Bishop of Ekwulobia
                              Diocese
                            </p>
                          </div>
                        </div>

                        <div className="group relative text-white overflow-hidden cursor-pointer h-auto">
                          <div className="h-64 w-full bg-[url('/Events/1726065592701.jpg')] bg-cover bg-no-repeat bg-center"></div>
                          <div className="absolute inset-0 bg-linear-to-b from-black/60 to-black/80 text-center translate-y-[100%] group-hover:translate-y-[70%] transition-all pt-4">
                            <p className="text-white italic font-semibold max-sm:text-sm">
                              A brief chat with the Bishop on Christianity and
                              Spiritual growth
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
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <button className="border border-black p-2">Cancel</button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div
          id="SchoolLife_container-3"
          className=" bg-[url('/istockphoto-620952978-612x612.jpg')] bg-cover bg-fixed bg-top-center "
        >
          <div className="flex justify-between content-center gap-8 py-32 px-10 w-full bg-primary/70 text-white leading-7 max-md:flex-wrap max-md:items-center max-md:px-8 max-sm:py-24">
            <p className="font-bold text-3xl w-2/5 max-md:text-2xl max-md:w-full max-sm:text-xl">
              A Legacy of Excellence
            </p>
            <p className="text-xl font-medium leading-8 w-4/5 max-sm:w-full max-sm:text-justify">
              Rosa Mystica High School, founded in 1966, is a renowned
              institution with a rich history of academic excellence and
              character development. We are committed to providing a world-class
              education that empowers students to reach their full potential.
            </p>
          </div>
        </div>

        <div id="SchoolLife_container-4" className="">
          <div className="flex w-full h-5/6 max-md:flex-wrap max-md:items-center">
            <div className="bg-[url('/BeautyPlus_Fr.jpg')] bg-cover bg-center bg-no-repeat w-full max-md:py-64 max-sm:py-32 max-md:hidden"></div>
            <div className="bg-[url('/BeautyPlus_20241106130216554_save.jpg')] bg-cover bg-center bg-no-repeat w-full max-md:py-64 max-sm:py-32 md:hidden max-md:visible"></div>
            <div className="bg-gray-200 flex items-center w-full py-36 max-sm:py-12">
              <div className="flex flex-col gap-6 px-16 ml-10 max-sm:ml-0">
                <div>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="w-12 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.516 7c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5l-0.016-0.5c0-3.866 3.134-7 7-7v2c-1.336 0-2.591 0.52-3.536 1.464-0.182 0.182-0.348 0.375-0.497 0.578 0.179-0.028 0.362-0.043 0.548-0.043zM12.516 7c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5l-0.016-0.5c0-3.866 3.134-7 7-7v2c-1.336 0-2.591 0.52-3.536 1.464-0.182 0.182-0.348 0.375-0.497 0.578 0.179-0.028 0.362-0.043 0.549-0.043z"></path>
                  </svg>
                </div>
                <p className="text-xl font-semibold leading-9 pr-20 max-sm:pr-0">
                  Our goal is to be at the heart of every game and keep the
                  winning pace across every distance.
                </p>
                <p className="text-lg font-semibold max-sm:text-sm">
                  Rev. Fr Paul Chimezie
                  <br />
                  <span className="font-normal">School Manager</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
