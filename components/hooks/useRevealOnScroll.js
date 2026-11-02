"use client";

import { useEffect } from "react";

// EntryCard keeps its garment cards and its timeline line hidden until
// something adds .is-visible, which app/page.js does with an IntersectionObserver.
// Any page that renders EntryCard on its own has to do the same, or that content
// never appears. Pass true once the card is actually on the page.
export function useRevealOnScroll(ready) {
  useEffect(() => {
    if (!ready) return undefined;
    const observer = new IntersectionObserver((seen) => {
      seen.forEach((node) => {
        if (!node.isIntersecting) return;
        node.target.classList.add("is-visible");
        observer.unobserve(node.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".yk-reveal").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ready]);
}