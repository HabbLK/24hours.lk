import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";
import Category from "@/models/Category";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ExternalLink, ArrowLeft, CheckCircle2, Clock } from "lucide-react";

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  
  const [guide, categories] = await Promise.all([
    TaskGuide.findOne({ slug, active: true }).lean(),
    Category.find({ active: true }).sort({ sortOrder: 1 }).lean(),
  ]);
  
  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={categories as any} />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-brand-red hover:text-brand-red-dk mb-8 transition-colors group animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
          
          {/* Guide Header */}
          <div className="mb-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Step-by-Step Guide
              </span>
              {guide.steps?.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {guide.steps.length} Steps
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-ink mb-4">{guide.title}</h1>
            {guide.description && (
              <p className="text-lg text-gray-600">{guide.description}</p>
            )}
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Your Progress</span>
              <span className="text-sm text-brand-red font-bold">0 / {guide.steps?.length || 0} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-red to-brand-gold h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="space-y-6">
            {guide.steps?.sort((a: any, b: any) => a.stepNumber - b.stepNumber).map((step: any, index: number) => (
              <div 
                key={index} 
                className="relative flex gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-brand-red/30 transition-all hover:shadow-lg group animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                {/* Step Number */}
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-brand-night to-brand-ink text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {step.stepNumber}
                </div>
                
                {/* Connecting Line (for all but last step) */}
                {index < (guide.steps?.length || 0) - 1 && (
                  <div className="absolute left-[27px] top-[70px] w-0.5 h-[calc(100%+24px)] bg-gradient-to-b from-gray-300 to-transparent -z-10" />
                )}
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-brand-ink pr-4 flex items-start gap-2">
                      {step.title}
                    </h3>
                    <CheckCircle2 className="w-6 h-6 text-gray-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  
                  {step.externalUrl && (
                    <a 
                      href={step.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-red-dk transition-all hover:scale-105 active:scale-95 shadow-lg group"
                    >
                      {step.linkLabel || "Go to Service"} 
                      <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Completion CTA */}
          <div className="mt-12 bg-gradient-to-br from-brand-night to-brand-ink text-white p-8 rounded-2xl shadow-xl text-center animate-fade-in-up">
            <h3 className="text-2xl font-heading font-bold mb-3">Need Help?</h3>
            <p className="text-gray-300 mb-6">If you have questions about this guide, feel free to reach out to our support team.</p>
            <Link 
              href="/"
              className="inline-block px-8 py-3 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              Explore More Guides
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
