import { useEffect, useState } from 'react';

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function Typewriter({ text, speed = 22, start = true, className = '', caret = true }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return undefined;
    }
    if (prefersReduced()) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, start]);

  const done = count >= text.length;
  return (
    <span className={`${className} ${caret && !done ? 'caret' : ''}`} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
    </span>
  );
}
