"use client";

// Slide.tsx
import { Splide, SplideSlide, type Options } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; // Basic styles
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Image from "next/image";

// The autoScroll options come from the splide-extension-auto-scroll plugin,
// which is not part of the core Splide options type.
type SlideOptions = Options & {
  autoScroll: {
    speed: number;
    pauseOnHover: boolean;
    pauseOnFocus: boolean;
    rewind: boolean;
  };
};

const options: SlideOptions = {
  type: "loop",
  // The original component passed the string "false" here, which Splide
  // treats as truthy (it only disables drag for boolean false), so
  // dragging was enabled. Boolean true preserves that behaviour.
  drag: true,
  perPage: 4,
  gap: "1rem",
  focus: "center",
  //   autoplay: true,
  pauseOnHover: false,
  pauseOnFocus: false,
  arrows: false,
  pagination: false,
  autoScroll: {
    speed: 1,
    pauseOnHover: false,
    pauseOnFocus: false,
    rewind: false,
  },
  breakpoints: {
    640: {
      perPage: 3,
    },
    1024: {
      perPage: 4,
    },
  },
};

function Slide() {
  return (
    <div className="slider-container">
      <Splide options={options} extensions={{ AutoScroll }}>
        <SplideSlide>
          <div
            className="slide h-[100px]"
            style={{ position: "relative", width: "100%" }}
          >
            <Image
              src="/swiper-RMHS/NECO.png"
              alt="NECO Slide"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SplideSlide>
        <SplideSlide>
          <div
            className="slide h-[100px]"
            style={{ position: "relative", width: "100%" }}
          >
            <Image
              src="/swiper-images/ministry.png"
              alt="NECO Slide"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SplideSlide>
        <SplideSlide>
          <div
            className="slide h-[100px]"
            style={{ position: "relative", width: "100%" }}
          >
            <Image
              src="/swiper-RMHS/JAMB.png"
              alt="NECO Slide"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SplideSlide>
        <SplideSlide>
          <div
            className="slide h-[100px]"
            style={{ position: "relative", width: "100%" }}
          >
            <Image
              src="/swiper-RMHS/Awka3.png"
              alt="NECO Slide"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SplideSlide>
        <SplideSlide>
          <div
            className="slide h-[100px]"
            style={{ position: "relative", width: "100%" }}
          >
            <Image
              src="/swiper-RMHS/WACE.png"
              alt="NECO Slide"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SplideSlide>
      </Splide>
    </div>
  );
}

export default Slide;
