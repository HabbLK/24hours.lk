export default function PartnerChips() {
  const partners = [
    "Department of Motor Traffic", "eChannelling", "SLTB", "PickMe", "Uber", "Kapruka", "Booking.com", "Osu Sala"
  ];

  return (
    <section className="bg-white py-12 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
          Find services from top providers
        </p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-8">
          {partners.map((partner, index) => (
            <span key={index} className="text-xl font-heading font-bold text-gray-300 mx-4">
              {partner}
            </span>
          ))}
          {/* Duplicate for seamless looping */}
          {partners.map((partner, index) => (
            <span key={`dup-${index}`} className="text-xl font-heading font-bold text-gray-300 mx-4">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
