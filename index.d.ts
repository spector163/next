import { CustomResize } from "~/utils/useResize";

declare global {
    interface WindowEventMap {
        customResize: CustomEvent<CustomResize>
    }
}

export { };
