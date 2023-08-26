import { useEffect, useRef, useState } from "react";

export function useOutsideTouch(ref: any) {

  const [isTouch, setIsTouch] = useState(false)
  const event = useRef<any>(null);

  useEffect(() => {
    event.current = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsTouch(true);
        // console.log('useOutsideTouch', 0);
      }
      else {
        setIsTouch(false);
        // console.log('useOutsideTouch', 1);
      }
    }

    document.addEventListener("mousedown", event.current);

    return () => {
      document.removeEventListener("mousedown", event.current);
    };
  }, [ref]);

  return isTouch;
}