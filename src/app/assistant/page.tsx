import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import RedirectBookingChat from "@/components/RedirectBookingChat";

export default function AssistantPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-brand-red text-xs font-bold uppercase tracking-[0.15em] mb-3">
              Booking assistant
            </p>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-brand-ink mb-2">
              What do you need to book?
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tell me naturally what you need and I&apos;ll find the right provider for you.
            </p>
          </div>

          <RedirectBookingChat />

          <div className="mt-8 text-center">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">Try saying</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Flight to Chennai", "Bus to Kandy on Friday", "Hotel in Colombo", "Doctor appointment"].map((hint) => (
                <span key={hint} className="text-[12px] text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                  &ldquo;{hint}&rdquo;
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
