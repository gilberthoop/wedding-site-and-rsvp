import { useEffect, useRef, useCallback } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Returns a ref to attach to a container.
 * Children with data-reveal attributes will be animated when scrolled into view.
 * Alternatively, pass a CSS selector to target specific children.
 */
export const useScrollReveal = (
  selector = '[data-reveal]',
  options: UseScrollRevealOptions = {}
) => {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = options;
  const containerRef = useRef<HTMLElement>(null);

  const observe = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = container.querySelectorAll<HTMLElement>(selector);

    if (prefersReducedMotion) {
      elements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, threshold, rootMargin]);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);

  return containerRef;
}
