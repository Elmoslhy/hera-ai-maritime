import { motion, useInView, useScroll, useTransform, animate } from "motion/react";
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Full-screen image background with parallax + Ken Burns on activation. */
export function SectionBackground({
  src,
  alt,
  overlay = "bg-navy/75",
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          width={1920}
          height={1088}
          className={`h-full w-full object-cover ${imgClassName} ${inView ? "ken-burns" : ""}`}
        />
      </motion.div>
      <div className={`absolute inset-0 ${overlay}`} />
      {children && (
        <motion.div style={{ y, containerType: "size" }} className="pointer-events-none absolute -inset-y-[8%] inset-x-0 overflow-hidden">
          {/* Box matching the photo's object-cover frame, so overlays stay on photo features */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc((100cqw - max(100cqw, 100cqh * 1920 / 1088)) * ${parseFloat(position) / 100})`, width: "max(100cqw, calc(100cqh * 1920 / 1088))", height: "max(100cqh, calc(100cqw * 1088 / 1920))" }}
          >
            {children}
          </div>
        </motion.div>
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