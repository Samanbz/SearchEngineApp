import useWindowDimensions from "./useWindowDimensions";
import { useDeferredValue } from "react";

const useBreakpoint = () => {
    const { width, height } = useWindowDimensions();

    switch (true) {
        case width > 2000:
            return "xxl";
        case width > 1600:
            return "xl";
        case width > 1200:
            return "lg";
        case width > 600:
            return "md";
        case width < 600:
            return "sm";
        default:
            return "xl";
    }
};

export default useBreakpoint;
