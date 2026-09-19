import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, useMotionValue, animate, type MotionValue } from "framer-motion";

/* Drives a 0→1 progress MotionValue on a loop while the element
   is on screen. Used to run the same scroll-driven stage UIs
   as self-playing loops on mobile. */
export function useLoopedSub<T extends Element>(
  duration = 5.5,
  repeatDelay = 1.2
): [React.RefObject<T | null>, MotionValue<number>] {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);

  useEffect(() => {
    if (reduced) {
      mv.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, [0, 1], {
      duration,
      repeat: Infinity,
      repeatDelay,
      ease: "linear",
    });
    return () => controls.stop();
  }, [inView, reduced, duration, repeatDelay, mv]);

  return [ref, mv];
}

/* Loops through `steps` states while the element is on screen.
   Returns [ref, step]. Attach ref to the watched element. */
export function useStepLoop<T extends Element>(steps: number, intervalMs = 1600, startDelay = 500, paused = false, loop = true) {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(steps - 1); // static end state
      return;
    }
    if (!inView || paused) return;
    let i = 0;
    setStep(i);
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i = (i + 1) % steps;
      setStep(i);
      if (loop || i < steps - 1) timer = setTimeout(tick, intervalMs);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [inView, steps, intervalMs, startDelay, reduced, paused, loop]);

  return [ref, step] as const;
}

/* Media query hook */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    mq.addEventListener("change", on);
    on();
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}
