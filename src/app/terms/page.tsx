import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export const metadata = {
  title: "Terms of Service | 24hours.lk",
  description: "Terms of Service for 24hours.lk",
};

export default async function TermsPage() {
  await connectDB();
  const categories = await Category.find({ active: true }).sort({ sortOrder: 1 }).lean();

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar categories={categories as any} />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-red mb-8 hover:text-brand-red-dk transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-none">
            <h1 className="text-4xl font-heading font-bold text-brand-ink mb-6">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using 24hours.lk ("the Platform"), operated by HABB Global Pvt Ltd, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Platform.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              24hours.lk is a digital hub and aggregator designed to guide users through real-life tasks in Sri Lanka by surfacing relevant information, sequential steps, and links to external services. <strong>We are not a booking engine</strong>, nor are we directly affiliated with the government entities or third-party businesses listed on our platform, unless explicitly stated.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">3. Accuracy of Information</h2>
            <p className="text-gray-600 mb-4">
              While we strive to keep our task guides, operating hours, and service details as accurate and up-to-date as possible, information may change without notice. We do not guarantee the accuracy, completeness, or usefulness of any information on the site and will not be held liable for any errors or omissions.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">4. Third-Party Links</h2>
            <p className="text-gray-600 mb-4">
              Our service guides often include links to third-party websites (e.g., government portals, private booking systems). We have no control over the content, terms, or privacy policies of these external sites and assume no responsibility for your interactions with them.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The platform's design, text, graphics, and structure are the intellectual property of HABB Global Pvt Ltd. You may not reproduce, distribute, or create derivative works without explicit written permission. Trademarks, logos, and service marks of external services belong to their respective owners.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Under no circumstances shall HABB Global Pvt Ltd be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Platform, including but not limited to lost time, missed appointments, or financial losses incurred through third-party services.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">7. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding these Terms of Service, you may contact us at <a href="mailto:info@habb.lk" className="text-brand-red hover:underline">info@habb.lk</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
