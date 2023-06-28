import { useCallback, useEffect, useRef, useState } from "react";

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
    trackTouch = false,
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

export default useSwipe;