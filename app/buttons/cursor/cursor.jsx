"use client";
import { useEffect, useRef, useState } from "react";
import "./cursor.scss";

export default function Cursor() {
  const elRef = useRef(null);
  const rafId = useRef(0);
  const x = useRef(0), y = useRef(0);
  const tx = useRef(0), ty = useRef(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setDisabled(isTouch || mql.matches);
    const onChange = (e) => setDisabled(isTouch || e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (disabled || !elRef.current) return;
    const el = elRef.current;

    const onMove = (e) => { tx.current = e.clientX; ty.current = e.clientY; };
    const onOver = (e) => {
      const overInteractive = e.target.closest?.("a,button,.interactive,[role='button']");
      el.classList.toggle("hover", !!overInteractive);
    };

    const animate = () => {
      // Interpolación (1 = seguir al instante; 0.2 = más "lag")
      const k = 1;
      x.current += (tx.current - x.current) * k;
      y.current += (ty.current - y.current) * k;
      // Centro el cursor (-50%, -50%) sin tocar layout
      el.style.transform = `translate3d(${x.current}px, ${y.current}px, 0) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(animate);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(rafId.current);
      else rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div ref={elRef} className="curzr-big-circle" aria-hidden="true">
      <div className="circle" />
      <div className="dot" />
    </div>
  );
}
