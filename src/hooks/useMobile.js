import { useEffect, useState } from 'react';

// Phones and touch screens. Keep in sync with the matching @media block in index.css.
export const MOBILE_QUERY = '(max-width: 767px), (pointer: coarse)';

const matches = () => typeof window !== 'undefined' && !!window.matchMedia?.(MOBILE_QUERY).matches;

export function useMobile() {
  const [mobile, setMobile] = useState(matches);
  useEffect(() => {
    const mq = window.matchMedia?.(MOBILE_QUERY);
    if (!mq) return undefined;
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return mobile;
}
