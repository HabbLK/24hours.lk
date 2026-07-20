"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Building2, CheckCircle, TrendingUp } from "lucide-react";

interface StatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}

function StatCard({ icon, value, label, suffix = "", delay }: StatProps) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;
    let timerId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      let current = 0;
      timerId = setInterval(() => {
        current += increment;
        if (current >= value) { setCount(value); clearInterval(timerId); }
        else setCount(Math.floor(current));
      }, stepDuration);
    }, delay);
    return () => { clearTimeout(timeoutId); clearInterval(timerId); };
  }, [value, delay, inView]);

  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-4xl font-heading font-bold text-white mb-1">
        {count.toLocaleString()}<span className="text-brand-gold">{suffix}</span>
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <img
        src="/images/sections/trust-banner.jpg"
        alt="Busy street in Colombo"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-night/85" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.15em] mb-3">
            By the numbers
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
            Trusted across Sri Lanka
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatCard icon={<Users className="w-6 h-6" />} value={50000} suffix="+" label="Happy users" delay={0} />
          <StatCard icon={<Building2 className="w-6 h-6" />} value={500} suffix="+" label="Service providers" delay={100} />
          <StatCard icon={<CheckCircle className="w-6 h-6" />} value={1000} suffix="+" label="Services listed" delay={200} />
          <StatCard icon={<TrendingUp className="w-6 h-6" />} value={99} suffix="%" label="Satisfaction" delay={300} />
        </div>
      </div>
    </section>
  );
}
