"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let timeoutId: NodeJS.Timeout;
    let timerId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let current = 0;
      timerId = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timerId);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timerId);
    };
  }, [value, delay]);

  return (
    <div className="text-center animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-red/10 rounded-xl mb-4 text-brand-red">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-heading font-bold text-brand-night mb-1 tracking-tight">
        <span className="text-2xl md:text-3xl">{count.toLocaleString()}</span><span className="text-brand-red ml-1">{suffix}</span>
      </div>
      <div className="text-sm md:text-base text-gray-600 font-medium">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-white py-16 md:py-20 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-ink mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join the growing community using 24hours.lk to access essential services
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          <StatCard
            icon={<Users className="w-7 h-7" />}
            value={50000}
            suffix="+"
            label="Happy Users"
            delay={0}
          />
          <StatCard
            icon={<Building2 className="w-7 h-7" />}
            value={500}
            suffix="+"
            label="Service Providers"
            delay={100}
          />
          <StatCard
            icon={<CheckCircle className="w-7 h-7" />}
            value={1000}
            suffix="+"
            label="Services Listed"
            delay={200}
          />
          <StatCard
            icon={<TrendingUp className="w-7 h-7" />}
            value={99}
            suffix="%"
            label="Satisfaction Rate"
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}
