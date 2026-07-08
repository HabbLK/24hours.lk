import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, ArrowLeft } from "lucide-react";

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  
  const guide = await TaskGuide.findOne({ slug, active: true }).lean();
  
  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-red mb-8 hover:text-brand-red-dk transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          
          <h1 className="text-4xl font-heading font-bold text-brand-ink mb-10">{guide.title}</h1>
          
          <div className="space-y-8">
            {guide.steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber).map((step: any, index: number) => (
              <div key={index} className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-night text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {step.stepNumber}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-brand-ink mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {step.externalUrl && (
                    <a 
                      href={step.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2 bg-brand-red text-white font-medium rounded-full hover:bg-brand-red-dk transition-colors"
                    >
                      {step.linkLabel || "Go to Service"} <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
