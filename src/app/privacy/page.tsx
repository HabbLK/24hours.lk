import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | 24hours.lk",
  description: "Privacy Policy for 24hours.lk",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-red mb-8 hover:text-brand-red-dk transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-none">
            <h1 className="text-4xl font-heading font-bold text-brand-ink mb-6">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              At 24hours.lk, we do not require users to create accounts or log in to use our public directory and guide services. Therefore, we do not actively collect personally identifiable information such as names, email addresses, or phone numbers unless you explicitly provide them to us via a contact form or inquiry.
            </p>
            <p className="text-gray-600 mb-4">
              We may automatically collect non-personal information, such as browser types, referring domains, and page interactions, to help us analyze traffic and improve user experience.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">2. External Links</h2>
            <p className="text-gray-600 mb-4">
              24hours.lk acts as a navigator and aggregator, routing you to third-party services and government portals. Please note that we are not responsible for the privacy practices of these external websites. We encourage you to read the privacy policies of any site you visit after clicking a link on our platform.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">3. Cookies</h2>
            <p className="text-gray-600 mb-4">
              We may use essential cookies to ensure the basic functionality of our website. We may also use analytics cookies to understand how our site is being used. You can disable cookies through your browser settings, though this may affect certain functionalities of the website.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">4. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to update or change our Privacy Policy at any time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h2 className="text-2xl font-bold text-brand-ink mt-8 mb-4">5. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@habb.lk" className="text-brand-red hover:underline">info@habb.lk</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
