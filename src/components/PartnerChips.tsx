export default function PartnerChips() {
  const partners = [
    "Department of Motor Traffic", "eChannelling", "SLTB", "PickMe", "Uber", "Kapruka", "Booking.com", "Osu Sala", "Sri Lankan Airlines", "Dialog Axiata"
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/5 border border-brand-red/10 rounded-full text-brand-red text-xs font-bold uppercase tracking-wider mb-4">
          Our Partners
        </div>
        <h3 className="text-2xl font-heading font-bold text-brand-ink mb-2">Trusted Partners</h3>
        <p className="text-sm text-gray-500">
          Find services from top providers across Sri Lanka
        </p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-10">
          {partners.map((partner, index) => (
            <span key={index} className="text-lg font-heading font-bold text-gray-300 hover:text-brand-red transition-colors duration-300 mx-3 cursor-default">
              {partner}
            </span>
          ))}
          {partners.map((partner, index) => (
            <span key={`dup-${index}`} className="text-lg font-heading font-bold text-gray-300 hover:text-brand-red transition-colors duration-300 mx-3 cursor-default">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
