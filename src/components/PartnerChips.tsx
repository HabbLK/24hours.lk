const partners = [
  { name: "Department of Motor Traffic" },
  { name: "eChannelling", logo: "/images/brand/echannelling.png" },
  { name: "SLTB" },
  { name: "PickMe", logo: "/images/brand/pickme.jpeg" },
  { name: "Uber Eats", logo: "/images/brand/uber-eats.png" },
  { name: "Kapruka", logo: "/images/brand/kapruka.png" },
  { name: "Booking.com", logo: "/images/brand/booking-com.jpeg" },
  { name: "Osu Sala" },
  { name: "SriLankan Airlines", logo: "/images/brand/srilankan-airlines.png" },
  { name: "Dialog Axiata" },
];

function PartnerItem({ partner }: { partner: (typeof partners)[number] }) {
  if (partner.logo) {
    return (
      <div className="flex items-center justify-center h-8 mx-5 shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
        <img src={partner.logo} alt={partner.name} className="h-full w-auto max-w-[100px] object-contain" />
      </div>
    );
  }
  return (
    <span className="text-base font-heading font-bold text-gray-300 hover:text-brand-red transition-colors mx-3 cursor-default shrink-0">
      {partner.name}
    </span>
  );
}

export default function PartnerChips() {
  return (
    <section className="bg-white py-14 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Trusted by leading providers</p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="py-3 animate-marquee whitespace-nowrap flex items-center">
          {partners.map((partner, i) => <PartnerItem key={i} partner={partner} />)}
          {partners.map((partner, i) => <PartnerItem key={`dup-${i}`} partner={partner} />)}
        </div>
      </div>
    </section>
  );
}
