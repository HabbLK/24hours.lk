import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import TaskGuide from "@/models/TaskGuide";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/guides"
            className="inline-flex items-center text-sm font-medium text-brand-red hover:text-brand-red-dk mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            All guides
          </Link>

          <div className="mb-8">
            <p className="text-xs font-bold text-brand-red uppercase tracking-wider mb-2">Guide</p>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink mb-3">{guide.title}</h1>
            {guide.keywords && guide.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {guide.keywords.map((keyword, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            {guide.steps?.sort((a: any, b: any) => a.stepNumber - b.stepNumber).map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-5 bg-white p-6 rounded-xl border border-gray-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-brand-ink text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {step.stepNumber}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-bold text-brand-ink mb-1.5">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.description}</p>

                  {step.externalUrl && (
                    <a
                      href={step.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white font-bold text-sm rounded-lg hover:bg-brand-red-dk transition-colors"
                    >
                      {step.linkLabel || "Go to Service"}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-4">Need help with something else?</p>
            <Link
              href="/guides"
              className="inline-block px-6 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white font-bold text-sm rounded-lg transition-colors"
            >
              Browse All Guides
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
