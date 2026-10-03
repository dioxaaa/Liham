import { useEffect, useState } from "react";

/**
 * Adds `data-visible="true"` to `.reveal` elements as they enter the viewport.
 * Falls back to showing everything immediately where IntersectionObserver is absent.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal:not([data-visible="true"])');
    if (targets.length === 0) return;

    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}