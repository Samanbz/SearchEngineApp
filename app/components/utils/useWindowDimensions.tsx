"use client";
import { useEffect, useState } from "react";

const useWindowDimensions = () => {
  function getWindowDimensions() {
    try {
      const { innerWidth: width, innerHeight: height } = window;
      return { width: width, height: height };
    } catch (error) {
      return { width: 0, height: 0 };
    }
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>(getWindowDimensions());

  return windowDimensions;
};

export default useWindowDimensions;
