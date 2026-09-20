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

    const revealElement = (el: HTMLElement) => {
      el.dataset.revealed = 'true';
      el.style.opacity = '1';
      el.style.transform = 'none';
    };

    if (prefersReducedMotion) {
      const revealAll = () => {
        const elements = container.querySelectorAll<HTMLElement>(selector);
        elements.forEach(revealElement);
      };
      revealAll();

      const mutationObserver = new MutationObserver(revealAll);
      mutationObserver.observe(container, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.dataset.revealed = 'true';
            const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
            if (delay > 0) {
              setTimeout(() => {
                if (el.isConnected) {
                  el.style.opacity = '1';
                  el.style.transform = 'none';
                }
              }, delay);
            } else {
              el.style.opacity = '1';
              el.style.transform = 'none';
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    const observeElements = () => {
      const elements = container.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        if (el.dataset.revealed !== 'true') {
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [selector, threshold, rootMargin]);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);

  return containerRef;
};
