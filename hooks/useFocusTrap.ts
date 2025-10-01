import { useEffect, useRef } from 'react';

export const useFocusTrap = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !ref.current) {
        return;
      }

      const focusableElements = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, []);

  return ref;
};
