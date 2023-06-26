import { useEffect, useState } from "react"
export type CustomResize = 'MOBILE' | "TABLET" | "DESKTOP"
export const useResize = () => {
    const [device, setDevice] = useState<CustomResize>('MOBILE')
    useEffect(() => {
        setDevice(window.innerWidth < 500 ? 'MOBILE' : window.innerWidth < 1000 ? 'TABLET' : 'DESKTOP');
        const cb = (e: CustomEvent<CustomResize>) => {
            setDevice(e.detail)
        }
        window.addEventListener('customResize', cb)
        return () => window.removeEventListener('customResize', cb)
    }, [])
    return device;
}

export default useResize;

export const useResizeParent = () => {
    useEffect(() => {
        const cb = () => {

            window.dispatchEvent(new CustomEvent('customResize', { detail: window.innerWidth < 500 ? 'MOBILE' : window.innerWidth < 1000 ? 'TABLET' : 'DESKTOP' }))
        }
        // const func = debounce(cb, 300)
        const func2 = throttle(cb, 500)
        window.addEventListener('resize', func2);
        return () => window.removeEventListener('resize', func2);
    }, [])
}

type Callback = (...args: any[]) => any;

export const debounce = (cb: Callback, wait = 100) => {
    let interval: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {

        clearTimeout(interval)
        interval = setTimeout(() => {
            cb.apply(this, args)
        }, wait)
    }
}

const throttle = (cb: Callback, wait = 300) => {
    let inThrottle: boolean;
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastTime: number;
    return function (this: any, ...args: any[]) {
        //excute first callback on the first time
        if (!inThrottle) {
            cb.apply(this, args);
            inThrottle = true;
            lastTime = Date.now();
        }
        //set a timer only if wait has elapsed and only excute the last call with appropriate time frame 
        else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastTime >= wait) {
                    cb.apply(this, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0))
        }
    }
}