import { motion, useReducedMotion, useInView, useScroll, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** Full-width static image background with a flat navy overlay sized per image for text contrast. */
export function SectionBackground({
  src,
  alt,
  imgClassName = "",
  children,
  position = "50%",
}: {
  src: string;
  alt: string;
  overlay?: string;
  imgClassName?: string;
  children?: React.ReactNode;
  position?: string;
}) {
  const alpha = src.includes("seker-europe-night") ? 0.82 : src.includes("seker-sar-port") ? 0.6 : 0.55;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img src={src} alt={alt} loading="lazy" decoding="async" width={1376} height={768} className={`h-full w-full object-cover ${imgClassName}`} style={{ objectPosition: `${position} 50%` }} />
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(6,20,40,${alpha})` }} />
      {children && (
        <div style={{ containerType: "size" }} className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc((100cqw - max(100cqw, 100cqh * 1376 / 768)) * ${parseFloat(position) / 100})`, width: "max(100cqw, calc(100cqh * 1376 / 768))", height: "max(100cqh, calc(100cqw * 768 / 1376))" }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(to);

  useEffect(() => {
    setValue(to);
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}