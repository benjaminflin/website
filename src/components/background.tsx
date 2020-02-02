import React, { useEffect, useRef } from "react";

interface BackgroundProps {
  canvas: HTMLCanvasElement;
}
const Background: React.FC<BackgroundProps> = ({ canvas }) => {
  const ref = useRef<HTMLDivElement>(null);
  const attached = useRef<boolean>(false);
  useEffect(() => {
    if (ref.current && !attached.current && typeof window !== `undefined`) {
      const div = ref.current;
      div.appendChild(canvas);
      attached.current = true;
    }
  }, [ref, attached]);

  return <div ref={ref}></div>;
};

export default Background;
