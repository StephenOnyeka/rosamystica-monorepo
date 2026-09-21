"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IoIosNotifications } from "react-icons/io";

const ScrollDiv = () => {
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > document.documentElement.scrollHeight / 12) {
        setShowDiv(true);
      } else {
        setShowDiv(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <nav className="navbar">
        <ul
          className="sidebar bg-contingent text-white"
          style={{ display: isOpen ? "flex" : "none" }}
        >
          <span className="tog flex justify-between content-center gap-12 ">
            <li onClick={toggleMenu} className="m-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                width="40"
                fill="#ffffff"
              >
                <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
              </svg>
            </li>

            <li className="mb-0 mt-8 mr-16">
              <Link href="/notifications">
                <span className="flex relative">
                  <IoIosNotifications size={38} color="white" />
                  <span className="absolute top-0 -left-3 relative flex h-4 w-4 ">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                  </span>
                </span>
              </Link>
            </li>
          </span>
          <li>
            <Link
              href="/"
              className={`text-white ${
                pathname === "/"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              Home
            </Link>{" "}
          </li>
          <li>
            <Link
              href="/about"
              className={`text-white ${
                pathname === "/about"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              About
            </Link>{" "}
          </li>
          <li>
            <Link
              href="/admission"
              className={`text-white ${
                pathname === "/admission"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              Admissions
            </Link>{" "}
          </li>
          <li>
            <Link
              href="/school-life"
              className={`text-white ${
                pathname === "/school-life"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              School Life
            </Link>{" "}
          </li>
          <li>
            <Link
              href="/give-to-RMHS"
              className={`text-white ${
                pathname === "/give-to-RMHS"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              Benefacio
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className={`text-white ${
                pathname === "/blogs"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/contactUs"
              className={`text-white ${
                pathname === "/contactUs"
                  ? "font-semibold border-primary border-b-2 text-xl bg-white/10"
                  : "hover:bg-white/10 hover:text-xl "
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div
        className={`fixed top-0 bg-contingent text-white px-8 pt-6 pb-4 max-md:py-3 max-sm:px-6 w-full z-10 ${
          showDiv ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between items-center justify-items-center ">
          <div className="logo">
            <div className="bg-[url('/images/RMHS.jpg')] w-10 h-10 rounded-full bg-cover bg-center max-sm:w-10 max-sm:h-10"></div>
          </div>
          <div className="flex space-x-5 gap-4">
            <span className="hideOnMobile">
              <Link
                href="/"
                className={` ${
                  pathname === "/"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                Home
              </Link>{" "}
            </span>
            <span className="hideOnMobile">
              <Link
                href="/about"
                className={` ${
                  pathname === "/about"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                About
              </Link>{" "}
            </span>
            <span className="hideOnMobile">
              <Link
                href="/admission"
                className={` ${
                  pathname === "/admission"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                Admissions
              </Link>{" "}
            </span>
            <span className="hideOnMobile">
              <Link
                href="/school-life"
                className={` ${
                  pathname === "/school-life"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                School Life
              </Link>{" "}
            </span>
            <span className="hideOnMobile">
              <Link
                href="/give-to-RMHS"
                className={` ${
                  pathname === "/give-to-RMHS"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                Benefacio
              </Link>
            </span>
            <span className="hideOnMobile">
              <Link
                href="/blogs"
                className={` ${
                  pathname === "/blogs"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                Blogs
              </Link>
            </span>
            <span className="hideOnMobile">
              <Link
                href="/contactUs"
                className={` ${
                  pathname === "/contactUs"
                    ? "font-semibold border-primary border-b-8 pb-2.5"
                    : "border-transparent border-b-8 hover:border-primary pb-2.5 hover:font-medium focus:font-semibold"
                }`}
              >
                Contact
              </Link>
            </span>
            <span
              className="menu-button"
              onClick={toggleMenu}
              style={{ display: isOpen ? "none" : "flex" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                fill="#ffffff"
                className="max-lg:w-10 "
              >
                <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollDiv;
