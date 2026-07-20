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
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/5 border border-brand-red/10 rounded-full text-brand-red text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
              Booking Assistant
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-ink tracking-tight mb-3">
              What do you need to book?
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Tell me naturally what you need — a flight, bus, hotel, or doctor appointment — and I&apos;ll find the right provider.
            </p>
          </div>

          {/* Chat */}
          <RedirectBookingChat />

          {/* Bottom hints */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Try saying</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                "Flight to Chennai",
                "Bus to Kandy on Friday",
                "Hotel in Colombo",
                "Doctor appointment",
              ].map((hint) => (
                <span
                  key={hint}
                  className="text-[12px] text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full"
                >
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
