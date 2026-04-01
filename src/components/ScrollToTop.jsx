import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll to the absolute top upon React Router path change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Do not smoothly scroll for page changes
    });
  }, [pathname]);

  return null;
}
