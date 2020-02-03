import React, { useEffect, useState } from "react";
import { main, cube, side, loading } from "./loader.module.css";
interface LoaderProps<T> {
  promise: Promise<T>;
  debounceMs?: number;
  children: (result: T) => React.ReactElement;
}

const Fallback = () => {
  return (
    <div className={main}>
      <div className={cube}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div className={side} key={i} />
        ))}
      </div>
      <span className={loading}>loading...</span>
    </div>
  );
};

const Loader: React.FC<LoaderProps<any>> = <T extends {}>({
  promise,
  children,
  debounceMs
}: LoaderProps<T>): React.ReactElement => {
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    promise
      .then(data => new Promise(res => setTimeout(() => res(data), debounceMs)))
      .then(setResult);
  }, []);

  return result ? children(result) : <Fallback />;
};

Loader.defaultProps = {
  debounceMs: 0
};

export default Loader;
