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

    setTimeout(() => {
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, delay);
  }, [value, delay]);

  return (
    <div className="text-center animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-2xl mb-4 text-brand-red">
        {icon}
      </div>
      <div className="text-4xl font-heading font-extrabold text-brand-night mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-white py-16 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-brand-ink mb-3">
            Trusted by Thousands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join the growing community using 24hours.lk to access essential services
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard
            icon={<Users className="w-8 h-8" />}
            value={50000}
            suffix="+"
            label="Happy Users"
            delay={0}
          />
          <StatCard
            icon={<Building2 className="w-8 h-8" />}
            value={500}
            suffix="+"
            label="Service Providers"
            delay={100}
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8" />}
            value={1000}
            suffix="+"
            label="Services Listed"
            delay={200}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
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
