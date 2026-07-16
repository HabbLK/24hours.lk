export default function PartnerChips() {
  const partners = [
    "Department of Motor Traffic", "eChannelling", "SLTB", "PickMe", "Uber", "Kapruka", "Booking.com", "Osu Sala", "Sri Lankan Airlines", "Dialog Axiata"
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h3 className="text-2xl font-heading font-bold text-brand-ink mb-2">Trusted Partners</h3>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          Find services from top providers across Sri Lanka
        </p>
      </div>
      <div className="relative flex overflow-x-hidden">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-12">
          {partners.map((partner, index) => (
            <span key={index} className="text-xl font-heading font-bold text-gray-400 hover:text-brand-red transition-colors mx-4 cursor-default">
              {partner}
            </span>
          ))}
          {/* Duplicate for seamless looping */}
          {partners.map((partner, index) => (
            <span key={`dup-${index}`} className="text-xl font-heading font-bold text-gray-400 hover:text-brand-red transition-colors mx-4 cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
