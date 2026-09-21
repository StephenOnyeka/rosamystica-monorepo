"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import CountUp from "react-countup";
import ScrollTrigger from "@/components/ScrollTrigger";
import Slide from "@/components/Slide";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import Footer from "@/components/Footer";
import { useSubscriptionsContext } from "@/hooks/useSubscriptionsContext";
import { BsBoxArrowUpRight } from "react-icons/bs";
import type { Subscription } from "@/lib/types";

type SubscriptionResponse = Subscription & {
  mssg?: string;
  error?: string;
  warn?: string;
};

function Home1() {
  const [counterOn, setCounterOn] = useState(false);

  const { dispatch } = useSubscriptionsContext();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null); //initialize with null
  const [mssg, setMssg] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subscription = { email };
    // Clear previous messages
    setError(null);
    setMssg(null);
    setWarn(null);

    const response = await fetch(
      "https://rmhsa-servered.vercel.app/api/subscriptions",
      {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const json = (await response.json()) as SubscriptionResponse;
    if (response.ok) {
      setEmail("");
      // setError() // Reset error on success
      console.log("new subscription added", json);
      setMssg(json.mssg ?? null);

      //dispatch action to add the new subscription to the context
      dispatch({ type: "CREATE_SUBSCRIPTION", payload: json });
    } else {
      // setError(json.error); //Set error message
      if (json.error) {
        setError(json.error);
      } else if (json.warn) {
        setWarn(json.warn); //set warning message
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMssg(null);
      setWarn(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  });

  return (
    <div className=" ">
      <ScrollDiv />
      <div className="font-poppins">
        <div id="Home" className="max-sm:overflow-hidden">
          <Topfile />

          <div className="bg-[url('/images/R-bmain.jpg')] bg-fixed bg-cover bg-no-repeat bg-center ">
            <div
              id="Home_container-1"
              className="bg-linear-to-b from-black/80 to-black/15 h-screen px-8 pt-8 max-sm:px-4 w-full text-white grid grid-cols-1"
            >
              <div className="">
                <Navbar />
              </div>
              {/* <div className="mt-32"> */}
              <div className="">
                <div className="flex flex-col items-start gap-5 max-sm:gap-3">
                  <p className="font-playfair italic text-5xl max-md:text-4xl max-sm:text-2xl max-sm:">
                    Welcome to{" "}
                  </p>
                  <p className="font-playfair text-8xl max-sm:text-5xl max-md:text-6xl max-lg:text-7xl">
                    <span className="font-bold">Rosa Mystica</span> High School,
                    <br />
                    Agulu.
                  </p>
                  {/* <p>{"{ R.M.H.S. }"}</p> */}
                  <Link href="/school-life">
                    <button className="bg-primary hover:bg-transparent hover:border hover:border-white text-white font-bold mt-2 px-8 py-4 max-sm:mt-6">
                      Take a Tour
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div id="Home_container-2">
            <div
              id="Home_container-2__content-1"
              className="flex w-full h-fit -mt-8 lg:px-4 max-md:px-4 max-md:flex-col max-md:items-center max-md:mb-8 max-lg:px-0 2xl:px-16 "
            >
              <div className=" w-1/3 h-fit max-md:w-4/6 max-sm:w-5/6 max-[500px]:w-11/12">
                <div className="bg-[#0099FF] max-w-full flex items-center p-8 gap-4 text-white">
                  {/* Done just now */}
                  <Image
                    src="/svgs/school-svgrepo-com.svg"
                    alt=""
                    color="white"
                    width={56}
                    height={100}
                    // layout="fill"
                    // objectFit="contain"
                    className="w-14"
                  />
                  <span>
                    <h3 className="font-bold">School Life</h3>
                    <p>Learn More</p>
                  </span>
                </div>
                <div className="max-w-full ">
                  <Image
                    // src="/images/R- main.jpg"
                    src="/Edited/1732230029126.jpg"
                    alt=""
                    width={500}
                    height={288}
                    // layout="fill"
                    // objectFit="contain"
                    className="w-full h-72 max-sm:h-fit"
                  />
                  <p className="py-8 pr-2 leading-6 text-sm text-gray-600">
                    Our school is more than just an institution; it's a
                    community that fosters intellectual curiosity, emotional
                    well-being, and personal growth. Students are encouraged to
                    explore their passions, develop their talents, and become
                    well-rounded individuals.
                  </p>
                </div>
              </div>

              <div className="w-1/3 h-96 max-md:w-4/6 max-md:h-fit max-sm:w-5/6 max-[500px]:w-11/12">
                <div className="bg-[#0083DA] max-w-full flex items-center p-8 gap-4 text-white">
                  <Image
                    src="/svgs/open-book-book-svgrepo-com.svg"
                    alt=""
                    color="white"
                    width={600}
                    height={800}
                    className="w-14"
                  />
                  <span>
                    <h3 className="font-bold">Academics</h3>
                    <p>Learn More</p>
                  </span>
                </div>
                <div className="max-w-full">
                  <div className="bg-[url('/RMHS/IMG_20241015_140156.jpg')] bg-cover bg-center w-full h-72 max-sm:h-fit"></div>
                  {/* <Image
                    src="/depositphotos_85888116-man-reading-a-book-in-the-office.jpg"
                    alt=""
                    className="w-full h-72 max-sm:h-fit"                    
                  /> */}
                  <p className="py-8 pr-2 leading-6 text-sm text-gray-600">
                    Our rigorous academic program is designed to challenge
                    students and prepare them for success in higher education
                    and beyond. With experienced faculty and state-of-the-art
                    facilities, we provide a stimulating learning environment
                    that inspires critical thinking and innovation.
                  </p>
                </div>
              </div>

              <div className="w-1/3 h-96 max-md:w-4/6 max-md:h-fit max-sm:w-5/6 max-[500px]:w-11/12">
                <div className="bg-[#006DB6] max-w-full flex items-center p-8 gap-4 text-white">
                  <Image
                    src="/svgs/sport-centre-svgrepo-com.svg"
                    alt=""
                    color="white"
                    width={56}
                    height={40}
                    className="w-14"
                  />
                  <span>
                    <h3 className="font-bold">Athletics</h3>
                    <p>Learn More</p>
                  </span>
                </div>
                <div className="max-w-full">
                  <div className="bg-[url('/RMHS/1730144543943.jpg')] bg-cover w-full h-72 max-sm:h-fit"></div>
                  {/* <Image
                    src="/studentAthlete.jpg"
                    alt=""
                    className="w-full h-72 max-sm:h-fit"
                  /> */}
                  <p className="py-8 pr-2 leading-6 text-sm text-gray-600">
                    Our athletics program emphasizes the importance of
                    sportsmanship, teamwork, and dedication. Through competitive
                    sports, students learn valuable life skills - perseverance,
                    resilience, and leadership!
                  </p>
                </div>
              </div>
            </div>

            <div
              id="Home_container-2__content-2"
              className="bg-[#0099FF]/20 pb-24"
            >
              <h2 className="text-center text-4xl max-sm:text-3xl  text-contingent-text font-medium py-16 ">
                Rosa Mystica At A Glance
              </h2>
              <ScrollTrigger
                onEnter={() => setCounterOn(true)}
                onExit={() => setCounterOn(false)}
              >
                <div className="">
                  {counterOn && (
                    <div className="flex justify-evenly content-center items-center text-center max-sm:gap-8 max-sm:px-2 max-sm:flex-wrap">
                      <div>
                        <p className="font-medium text-6xl max-sm:text-4xl max-md:text-5xl text-primary pb-5 max-sm:pb-2">
                          <CountUp start={0} end={500} duration={3} />
                          <span className="text-secondary">+</span>
                        </p>
                        <p className="text-gray-500 max-sm:text-xs">
                          Active Students
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-6xl max-sm:text-4xl max-md:text-5xl text-primary pb-5 max-sm:pb-2">
                          <CountUp start={0} end={5000} duration={3} />
                          <span className="text-secondary">+</span>
                        </p>
                        <p className="text-gray-500 max-sm:text-xs">
                          Graduated Students
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-6xl max-sm:text-4xl max-md:text-5xl text-primary pb-5 max-sm:pb-2">
                          <CountUp start={0} end={100} duration={3} />
                          <span className="text-secondary">+</span>
                        </p>
                        <p className="text-gray-500 max-sm:text-xs">
                          Qualified Teachers
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollTrigger>
            </div>
          </div>

          <div id="Home_container-3" className="h-full ">
            {/* <span> */}
            <div
              id="Home_container-3__content-1"
              className="bg-[url('/istockphoto-620952978-612x612.jpg')] bg-cover bg-no-repeat bg-center
              flex justify-end items-center content-center text-white h-5/6 -ml-16 max-md:bg-cover max-md:content-center max-md:justify-center max-md:-ml-0"
            >
              <div className="bg-primary/70 px-20 leading-7 w-1/2 max-md:w-5/6 max-sm:w-full py-28 max-sm:px-6 max-sm:py-20">
                <div className="my-8 leading-8">
                  <p className="text-4xl max-sm:text-3xl font-bold pb-2">
                    Apply for Admission
                  </p>
                  <p className="text-lg max-sm:text-base ">
                    Fall 2024 applications are now open
                  </p>
                </div>
                <p className="text-lg max-sm:text-base">
                  We don't just give students an education and experiences that
                  set them up for success in a career. We help them succeed in
                  their career- to discover a field they're passionate about and
                  dare to lead it.
                </p>
                <Link href="/admission">
                  <button className="border border-white max-sm:border-white max-sm:text-white font-bold mt-8 px-8 py-4">
                    Apply Now
                  </button>
                </Link>
              </div>
            </div>
            {/* </span> */}

            <div id="Home_container-3__content-2" className="pt-16">
              <p className="text-4xl max-sm:text-2xl font-medium um text-center text-contingent-text">
                Educational Affliations
              </p>

              <div className="my-10">
                <Slide />
              </div>

              <div id="facilities" className="my-16 bg-[]">
                <h1 className="max-sm:mt-24 text-4xl max-sm:text-2xl text-center text-contingent-text font-medium ">
                  Rosa Mystica Facilities
                </h1>
                <div className="flex flex-col items-center justify-between ">
                  <Link href="/gallery">
                    <button className="flex gap-4 items-center bg-primary hover:bg-blue-400 border border-gray-200 rounded-lg text-white px-6 py-4 my-8 mb-20">
                      <span> Visit Page </span>
                      <BsBoxArrowUpRight />
                    </button>
                  </Link>

                  <span className="flex text-center gap-16 flex-wrap justify-center max-md:gap-10">
                    <div className="flex flex-col items-center justify-center gap-8 max-sm:gap-4 w-80 h-64 max-md:h-fit max-md:w-4/6">
                      {/* <div className="bg-primary hover:bg-blue-50 border text-white hover:text-black w-fit h-fit rounded-full">
                        Icon
                      </div> */}
                      <div>
                        <h1 className="text-contingent text-xl font-medium pb-4 max-sm:text-lg">
                          Eco-Friendly Environment
                        </h1>
                        <p className="text-gray-500 leading-7 max-sm:text-sm">
                          We maintain the excellent standard in designing
                          {/* eco-friendly structures and layout for healthy & */}
                          adaptive learning.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-8 max-sm:gap-4 w-80 h-64 max-md:h-fit max-md:w-4/6">
                      {/* <div className="bg-primary hover:bg-blue-50 border text-white hover:text-black w-fit h-fit rounded-full">
                        Icon
                      </div> */}
                      <div>
                        <h1 className="text-contingent text-xl font-medium pb-4 max-sm:text-lg">
                          Innovative Classrooms
                        </h1>
                        <p className="text-gray-500 leading-7 max-sm:text-sm">
                          Our classrooms are designed to inspire learning and
                          support emotional and physical wellness excellently.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-8 max-sm:gap-4 w-80 h-64 max-md:h-fit max-md:w-4/6">
                      {/* <div className="bg-primary hover:bg-blue-50 border text-white hover:text-black w-fit h-fit rounded-full">
                        Icon
                      </div> */}
                      <div>
                        <h1 className="text-contingent text-xl font-medium pb-4 max-sm:text-lg">
                          Relevant Amenities
                        </h1>
                        <p className="text-gray-500 leading-7 max-sm:text-sm">
                          From Dedicated and furnished laboratories, to sports
                          centers and center for skill acquisition.
                        </p>
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              <div className="h-full">
                <div className="flex w-full gap-8 justify-center max-md:flex-wrap pb-28">
                  {/* <div id="Donor" className="bg-[url('/the-samford-clock-tower-jc-findley.jpg')] w-full p-10 min-h-max"> */}
                  <div id="Donor" className="w-full p-10  max-md:w-5/6">
                    <span className="flex items-center gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="white"
                        className="bi bi-link-45deg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z" />
                      </svg>
                      <p className="text-2xl font-bold text-white">
                        Quick Links
                      </p>
                    </span>

                    <br />
                    {/* <br /> */}
                    <ul className="text-base font-semibold text-white">
                      <li className="mt-4">
                        <Link
                          href={`https://wa.me/+1(347)440-9767?text=${encodeURIComponent(
                            "Hello, I'm reaching out as an alumna of Rosa Mystica High School.\n\n" +
                              "Name: \n" +
                              "Class set of: \n" +
                              "Our Class President's Name: \n\n" +
                              "I would like to connect with the RMHS alumnae group.",
                          )}`}
                        >
                          Alumnae Group
                        </Link>
                      </li>
                      <br />
                      <hr />
                      <li className="mt-4">
                        <Link
                          href="/PDF/THIRD TERM CALENDAR FOR 2026.pdf"
                          target="_blank"
                        >
                          Academic Calendar
                        </Link>
                      </li>
                      <br /> <hr />
                      <li className="mt-4">
                        {" "}
                        <Link href="https://portal.rmhsagulu.com.ng/resultchecker.aspx">
                          School Portal
                        </Link>{" "}
                      </li>
                      {/* <br /> <hr />
                      <li className="mt-4"> Partnership & Out Reach </li> */}
                      <br /> <hr />
                      {/* <li className="mt-4"> Academic Programs</li>
                      <br /> <hr /> */}
                      <li className="mt-4"> Tuition And Fees </li>
                      <br /> <hr />
                      <li className="mt-4">
                        {" "}
                        <Link href="/give-to-RMHS">Support Rosa Mystica</Link>
                      </li>
                      <br /> <hr />
                    </ul>
                  </div>

                  <div className="w-full text-center flex flex-col items-center justify-center gap-8 h-fit max-md:w-5/6">
                    {/* <div className="flex flex-col items-center justify-center gap-8 w-80 h-64"> */}
                    <div className="mt-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        // height="16"
                        fill="#F8940F"
                        className="bi bi-envelope"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
                      </svg>
                    </div>
                    <form action="" onSubmit={handleSubmit} className="px-8">
                      <h1 className="text-contingent text-xl font-bold pb-2">
                        Subscribe To Newsletter
                      </h1>
                      <p className="text-black pb-4">
                        Get updates to news & events
                      </p>
                      {/* <p className="text-gray-500 leading-6 text-sm px-12"> */}
                      <p className="text-gray-500 leading-6 text-sm"></p>
                      <div className="">
                        <input
                          type="text"
                          className="bg-gray-200 p-4 w-full mt-10 max-lg:text-sm max-sm:text-xs"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="bg-primary hover:opacity-70 p-4 w-full mt-4 text-white font-semibold">
                          Subscribe
                        </button>
                        {error && (
                          <div className="text-red-500 border border-red-500 bg-red-100 p-2 mt-4">
                            {error}
                          </div>
                        )}
                        {mssg && (
                          <div className="text-green-500 border border-green-500 bg-green-100 p-2 mt-4">
                            {mssg}
                          </div>
                        )}
                        {warn && (
                          <div className="text-yellow-500 border border-yellow-500 bg-yellow-100 p-2 mt-4">
                            {warn}
                          </div>
                        )}
                      </div>
                    </form>

                    {/* </div> */}
                  </div>

                  <div className="w-full flex flex-col items-center justify-center gap-8 h-fit max-md:w-5/6 ">
                    {/* <div className="flex flex-col items-center justify-center gap-8 w-80 h-64"> */}
                    <div className="w-full h-[200px] relative">
                      <Image
                        // width={250}
                        // height={150}
                        fill
                        // className="object-cover"
                        className="object-contain"
                        src="/grad1.png"
                        alt=""
                      />
                    </div>
                    <div className="px-0">
                      <h1 className="text-contingent text-xl font-bold pb-2">
                        Donation helps us
                      </h1>
                      {/* <p className="text-gray-500 leading-6 text-sm px-12"> */}
                      <p className="text-gray-500 leading-6 text-sm">
                        Join us in shaping the future of Rosa Mystica High
                        School. Your donation, no matter the size, will make a
                        significant impact on our students, faculty, and
                        programs.
                      </p>
                      <Link href="/give-to-RMHS">
                        <button className="bg-primary hover:opacity-70 p-4 mt-4 text-white font-semibold">
                          <span className="flex items-center gap-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="white"
                              className="bi bi-heart-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                              />
                            </svg>
                            <p className="text-sm">Become a donor</p>
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home1;
