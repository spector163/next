import Image from "next/image";
import React, {
  TouchEvent,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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
  const [currentIndex, setcurrentIndex] = useState(0);
  const handleButton = (direction: "left" | "right") => {
    if (direction == "left") {
      setcurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setcurrentIndex((prev) => (prev + 1) % images.length);
    }
  };
  const swipeHandlers = useSwipe({
    trackMouse: true,
    trackTouch: true,
    cbNext: () => handleButton("right"),
    cbPrev: () => handleButton("left"),
    autoPlay: true,
  });
  const ref = useRef(null);
  console.log(currentIndex, "currentIndex");
  return (
    <div className="container__carousal relative" {...swipeHandlers}>
      <button onClick={() => handleButton("left")} className="left">
        left
      </button>
      <TransitionGroup
        className="absolute inset-0 mx-auto grid aspect-square w-[90%] max-w-[600px] grid-cols-1"
        ref={ref}
      >
        {images.map((item, index) => (
          <ChildItem
            key={index}
            alt={item.alt}
            enter={currentIndex == index}
            src={item.src}
          />
        ))}
      </TransitionGroup>
      {/* <div className="img__test">{images[currentIndex]?.alt}</div> */}
      <button onClick={(e) => handleButton("right")} className="right">
        right
      </button>
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
      timeout={500}
      ref={ref}
      mountOnEnter
      unmountOnExit
    >
      <div ref={ref}>
        <Image
          src={src}
          ref={ref}
          alt={alt}
          width={500}
          height={400}
          draggable={false}
          className="col-[1/1] row-[1/1] h-full w-full object-cover"
          quality={100}
        />
      </div>
    </CSSTransition>
  );
};

type SwipeOptions = {
  trackMouse?: boolean;
  trackTouch?: boolean;
  cbNext: () => void;
  cbPrev: () => void;
  autoPlay?: boolean;
  timer?: number;
};

const useSwipe = ({
  trackMouse = false,
  trackTouch = true,
  cbNext,
  cbPrev,
  autoPlay = false,
  timer = 2000,
}: SwipeOptions) => {
  const [pause, setPause] = useState(false);
  const startPos = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!autoPlay) return;

    const startInterval = () => {
      intervalRef.current = setInterval(cbNext, timer);
    };

    if (pause) {
      clearInterval(intervalRef.current);
    } else {
      startInterval();
    }

    return () => clearInterval(intervalRef.current);
  }, [autoPlay, pause]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startPos.current = e.touches[0]?.clientX ?? 0;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const endPos = e.changedTouches[0]?.clientX ?? 0;
    const diffPos = startPos.current - endPos;
    autoPlay && pauseAutoplay(5000); // Adjust the duration as needed
    if (Math.abs(diffPos) > 50) {
      diffPos > 0 ? cbNext() : cbPrev();
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    clearInterval(intervalRef.current);
    startPos.current = e.clientX;
  }, []);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    const endPos = e.clientX;
    const diffPos = startPos.current - endPos;
    autoPlay && pauseAutoplay(5000);

    if (Math.abs(diffPos) > 50) {
      diffPos > 0 ? cbNext() : cbPrev();
    }
  }, []);
  const pauseAutoplay = useCallback((duration: number) => {
    setPause(true);
    setTimeout(() => {
      setPause(false);
    }, duration);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        autoPlay && pauseAutoplay(5000);
        cbPrev();
      } else if (event.key === "ArrowRight") {
        autoPlay && pauseAutoplay(5000);
        pauseAutoplay(5000);
        cbNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cbNext, cbPrev]);

  return {
    onTouchStart: trackTouch ? onTouchStart : undefined,
    onTouchEnd: trackTouch ? onTouchEnd : undefined,
    onMouseDown: trackMouse ? onMouseDown : undefined,
    onMouseUp: trackMouse ? onMouseUp : undefined,
  };
};
