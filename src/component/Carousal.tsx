import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useSwipe from "~/utils/useSwipe";
import { BiSolidChevronLeft, BiSolidChevronRight } from "react-icons/bi";
const images = [
  {
    src: "/first.jpg",
    alt: "Image 1",
    legend: "Legend 1",
    id: 0,
  },
  {
    src: "/second.jpg",
    alt: "Image 2",
    legend: "Legend 2",
    id: 1,
  },
  {
    src: "/third.jpg",
    alt: "Image 3",
    legend: "Legend 3",
    id: 2,
  },
  {
    src: "/fourth.jpg",
    alt: "Image 3",
    legend: "Legend 3",
    id: 3,
  },
];
let render = 0;

const Carousal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleButton = useCallback((dir: "left" | "right") => {
    if (dir == "left") {
      setActiveIndex((v) => (v - 1 + images.length) % images.length);
    } else {
      setActiveIndex((v) => (v + 1) % images.length);
    }
  }, []);

  const swiperHandler = useSwipe({
    trackMouse: true,
    cbNext: () => handleButton("right"),
    cbPrev: () => handleButton("left"),
    autoPlay: false,
  });
  console.log(activeIndex, "activeIndex");
  return (
    <div
      className="relative mx-auto my-4 w-[min(750px,95%)] rounded-sm  p-4"
      {...swiperHandler}
    >
      <button
        className="absolute -left-4 top-1/2 -translate-y-1/2 border border-black bg-white p-2 shadow-md shadow-[#999] transition-transform duration-300 ease-out active:scale-75"
        onClick={() => handleButton("left")}
      >
        <BiSolidChevronLeft size={20} />
      </button>
      <button
        className="absolute -right-4 top-1/2 -translate-y-1/2 border border-black bg-white p-2 shadow-md  shadow-[#999] transition-transform duration-300 ease-out active:scale-75"
        onClick={() => handleButton("right")}
      >
        <BiSolidChevronRight size={20} />
      </button>
      <TransitionGroup className="relative -z-10 aspect-[3/2] w-full overflow-hidden">
        {images.map((item, index) => (
          <ChildItem
            key={index}
            alt={item.alt}
            src={item.src}
            enter={index == activeIndex}
          />
        ))}
      </TransitionGroup>
    </div>
  );
};

export default Carousal;

const ChildItem = ({
  enter,
  src,
  alt,
}: {
  enter: boolean;
  src: string;
  alt: string;
}) => {
  const ref = useRef(null);
  return (
    <CSSTransition
      classNames="carousel-transition"
      in={enter}
      timeout={5000}
      nodeRef={ref}
      mountOnEnter
      unmountOnExit
    >
      <Image
        src={src}
        ref={ref}
        alt={alt}
        width={500}
        height={400}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover "
        quality={100}
      />
    </CSSTransition>
  );
};
