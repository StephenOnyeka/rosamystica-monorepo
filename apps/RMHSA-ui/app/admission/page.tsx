import Link from "next/link";
import { CgEditBlackPoint } from "react-icons/cg";

import ScrollDiv from "@/components/Scroll";
import Navbar from "@/components/Navbar";
import Topfile from "@/components/Topfile";
import SchoolJsonLd from "@/components/SchoolJsonLd";
import { pageMetadata } from "@/lib/seo";

const admissionSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Admission - Rosa Mystica High School",
  description:
    "Apply to Rosa Mystica High School and join our community of change-makers.",
  mainEntity: {
    "@type": "EducationalOrganization",
    name: "Rosa Mystica High School",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Admission Process",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Junior Secondary School Admission",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Senior Secondary School Admission",
          },
        },
      ],
    },
  },
};

export const metadata = pageMetadata("admission", {
  keywords:
    "Admission Rosa Mystica High School, Apply to School, School Application, Admission Requirements, School Enrollment, Join School, Student Application Process",
  image: "https://www.rmhsagulu.com/Edited/1732230029220.jpg",
});

export default function Admission() {
  return (
    <div>
      <SchoolJsonLd extraSchema={[admissionSchema]} />
      <Topfile />
      <ScrollDiv />
      <div className="h-full font-poppins overflow-hidden">
        <div className="bg-[url('/Edited/1732230029220.jpg')] bg-cover bg-top">
          <div
            id="Admission_container-1"
            className="bg-linear-to-b from-black/50 to-black/80 px-8 pt-8 max-sm:px-4 w-full font-poppins text-white"
          >
            <div className=" ">
              <Navbar />
            </div>

            <div className="pt-[50%] pb-[5%] lg:pt-[30%] z-1 text-white">
              <p className="text-xl pb-3 max-sm:text-lg max-sm:pb-1">
                Admission
              </p>
              <p className="text-5xl font-bold max-sm:text-3xl">
                Apply To Rosa Mystica
              </p>
            </div>
          </div>
        </div>

        <div>
          <div id="Admission_container-2" className="px-8 py-6 max-sm:px-2">
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
                Apply To Rosa Mystica
              </Link>
            </span>
            <div className="py-10">
              <div className="flex gap-8 max-xl:flex-wrap max-xl:justify-content ">
                <div>
                  <p className=" leading-10 min-w-60 px-6 text-2xl font-bold pb-8 text-black max-sm:px-2 max-sm:text-xl">
                    Join a Community of Change-Makers
                  </p>
                  <div className="flex max-xl:flex-wrap max-xl:justify-content max-xl:gap-4">
                    <p className=" text-gray-500 leading-7 min-w-60 px-6 max-sm:px-2 max-sm:leading-6 max-sm:text-sm max-sm:text-justify">
                      Are you ready to be part of a vibrant community that's
                      shaping the future? We're looking for passionate and
                      talented students who share our vision of a better
                      tomorrow. Our admissions process is holistic, considering
                      your academic achievements, personal qualities, and
                      potential to contribute to our diverse community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            id="Admission_container-3"
            className="flex items-center px-10 gap-8 bg-contingent h-[50vh] text-white leading-7 max-md:h-fit py-10 max-md:flex-wrap max-md:leading-6 max-sm:gap-12"
          >
            <div className="">
              <p className="font-bold text-xl max-sm:text-lg">
                A Legacy of Excellence
              </p>
              <br />
              <p>
                Founded in 1966 by the late Archbishop CharlesHeery C.S. SP.,
                Archbishop of Onitsha, Rosa Mystica High School has a
                long-standing tradition of academic excellence and character
                development.
              </p>
            </div>
            <div className="">
              <p className="font-bold text-xl max-sm:text-lg">
                A Vibrant Campus Life
              </p>
              <br />
              <p>
                Experience a dynamic campus life filled with opportunities to
                explore your passions. From academic clubs and sports teams to
                arts and cultural events, there's something for everyone.
              </p>
            </div>
          </div>
        </div>

        <div
          id="Admission_container-4"
          className="bg-[url('/Edited/1732230029200.jpg')] bg-no-repeat bg-cover bg-fixed leading-7 bg-center max-sm:bg-contain "
        >
          <div className="h-screen max-sm:h-[calc(100vh/3)]"></div>
        </div>

        <div
          id="Admission_container-5"
          className="h-full px-12 py-16 max-md:px-4"
        >
          <p className="text-3xl font-bold py-8 max-md:text-2xl ">
            The Application Process
          </p>
          <div className="grid grid-cols-3 gap-10 max-md:grid-cols-2 max-sm:flex max-sm:flex-wrap max-sm:items-center">
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                1
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg ">
                  Start Online Submission
                </p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  Begin your journey by completing our online application form.
                </p>
              </div>
            </div>
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                2
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg"> Submit The Form</p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  Once you've filled out the form, submit it to our admissions
                  office
                </p>
              </div>
            </div>
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                3
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg">
                  Review The Submission
                </p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  Our admissions committee will carefully review your
                  application
                </p>
              </div>
            </div>
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                4
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg">
                  Gather Necessary Documents
                </p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  Prepare the necessary documents, such as transcripts and test
                  scores.
                </p>
              </div>
            </div>
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                5
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg">
                  Interviewing Process
                </p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  Selected applicants may be invited to an interview with our
                  admissions team.
                </p>
              </div>
            </div>
            <div className="flex gap-6 max-sm:gap-4">
              <p className="text-5xl max-sm:text-3xl font-bold text-red-600">
                6
              </p>
              <div>
                <p className="font-semibold pb-4 text-lg"> Last Decision</p>
                <p className="max-sm:text-sm max-sm:leading-6">
                  You will receive a notification of our decision according to
                  the admission calendar.
                </p>
              </div>
            </div>
          </div>
          <a href="https://forms.gle/ypvwbo4a3fqAEX7q8">
            <button className="bg-primary py-2 px-6 text-white mt-4">
              Take test{" "}
            </button>
          </a>
        </div>
        <div className="flex w-full justify-center">
          <hr className="border border-contingent w-5/6" />
        </div>

        <div className="h-fit max-sm:text-sm">
          <div className="flex py-8 px-8 gap-8 justify-between w-full text-gray-500 max-md:flex-wrap max-md:items-center max-sm:px-4">
            <div className="flex flex-col gap-8 w-1/2 max-md:w-full">
              <p className="font-bold text-xl text-black">
                {" "}
                Things To Know First
              </p>
              <p>
                {" "}
                To apply to Rosa Mystica High School, you'll need to complete
                the <b>Common Application.</b>
              </p>
              <p> You will need: </p>

              <div className="flex items-center gap-4">
                <CgEditBlackPoint className="text-black w-12 h-12 " />
                <p>
                  <span className="font-bold"> Contact information:</span>{" "}
                  Provide the contact details of your previous school counselor
                  or representative who will complete your Common Application
                  School Report and submit your official previous school
                  transcript.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <CgEditBlackPoint className="text-black w-7 h-7 " />
                <p>
                  <span className="font-bold"> Course Selection:</span> If
                  you're applying to a senior-level program, you'll have the
                  opportunity to select specific courses of interest.
                </p>
              </div>
              <div className="flex gap-4 text-white font-semibold">
                <Link href="/gallery">
                  <button className="bg-primary p-6 max-sm:p-4">
                    Request a school tour
                  </button>
                </Link>
                <Link href="/about#RosaMystica">
                  <button className="bg-contingent p-6 max-sm:p-4">
                    Request information {/** Lead to contact page*/}
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-8 w-1/2 max-md:w-full">
              <p className="font-bold text-xl text-black">When To Apply</p>
              <table className="text-center">
                <thead>
                  <tr className=" text-white ">
                    <th className="bg-primary p-4 border-2 border-white"> </th>
                    <th className="bg-primary p-4 border-2 border-white font-medium">
                      {" "}
                      Application Deadline{" "}
                    </th>
                    <th className="bg-primary p-4 border-2 border-white font-medium">
                      {" "}
                      Decision{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-200">
                    <td className="p-4 border-2 border-white">
                      Early Decision 1
                    </td>
                    <td className="p-4 border-2 border-white">November 1</td>
                    <td className="p-4 border-2 border-white">December 15</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="p-4 border-2 border-white">
                      Early Decision 2
                    </td>
                    <td className="p-4 border-2 border-white">January 1</td>
                    <td className="p-4 border-2 border-white">February 15</td>
                  </tr>
                  <tr className="bg-gray-200">
                    <td className="p-4 border-2 border-white">
                      Regular Decision
                    </td>
                    <td className="p-4 border-2 border-white">January 1</td>
                    <td className="p-4 border-2 border-white">April 1</td>
                  </tr>
                </tbody>
              </table>

              <div>
                <p className="text-xl text-black font-bold">
                  Where to submit Necessary documents?
                </p>

                <br />
                <p className="">
                  Document not submitted through the online method can be mailed
                  to: // The school's Post Office Box
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
