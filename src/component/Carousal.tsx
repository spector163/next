import Image from "next/image";
import React, { TouchEvent, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
const images = [
  { src: "/first.jpg", alt: "Image 1", legend: "Legend 1", id: 0 },
  { src: "/second.jpg", alt: "Image 2", legend: "Legend 2", id: 1 },
  { src: "/third.jpg", alt: "Image 3", legend: "Legend 3", id: 2 },
  { src: "/fourth.jpg", alt: "Image 3", legend: "Legend 3", id: 3 },
];
const Carousal = () => {
  const [currentIndex, setcurrentIndex] = useState(0);
  const currentIntervelref = useRef<NodeJS.Timer>();
  const touchStartPos = useRef<number>(0);
  useEffect(() => {
    currentIntervelref.current = setInterval(() => {
      setcurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(currentIntervelref.current);
  }, []);
  const handleButton = (direction: "left" | "right") => {
    clearInterval(currentIntervelref.current);
    if (direction == "left") {
      setcurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setcurrentIndex((prev) => (prev + 1) % images.length);
    }
  };
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartPos.current = e.touches[0]?.clientX ?? 0;
    console.log("touch start");
  };
  const handleTouchEnd = (event: React.TouchEvent) => {
    const touchEndPos = event.changedTouches[0]?.clientX ?? 0;
    const touchDiff = touchStartPos.current - touchEndPos;
    console.log("touch end");
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        handleButton("right");
      } else {
        handleButton("left");
      }
    }
  };
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    touchStartPos.current = event.clientX;
    console.log("mouse down");
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    const touchEndPos = event.clientX;
    const touchDiff = touchStartPos.current - touchEndPos;
    console.log("mouse up");

    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        handleButton("right");
      } else {
        handleButton("left");
      }
    }
  };

  return (
    <div
      className="container__carousal"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <button onClick={() => handleButton("left")} className="left">
        left
      </button>
      <CSSTransition
        in={currentIndex == images[currentIndex]?.id}
        timeout={500}
        classNames="carousel-transition"
        appear
        unmountOnExit
        mountOnEnter
      >
        <Image
          src={images[currentIndex]?.src ?? ""}
          alt={images[currentIndex]?.alt ?? ""}
          width={500}
          height={400}
          draggable={false}
          className="h-full w-full object-cover"
          quality={100}
        />
      </CSSTransition>
      {/* <div className="img__test">{images[currentIndex]?.alt}</div> */}
      <button onClick={(e) => handleButton("right")} className="right">
        right
      </button>
    </div>
  );
};

export default Carousal;
